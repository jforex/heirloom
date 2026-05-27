#[test_only]
module heirloom::vault_tests;

use std::string;
use sui::clock;
use sui::test_scenario as ts;
use heirloom::vault::{Self, Vault};

const OWNER: address = @0xA1;
const HEIR: address = @0xB2;
const STRANGER: address = @0xC3;

const GRACE_MS: u64 = 1_000_000; // arbitrary window for the test

// We can't call the private `seal_approve` from a test, so we test the
// `is_released` view (same time logic) plus the heir membership rules.
#[test]
fun test_release_lifecycle() {
    let mut scenario = ts::begin(OWNER);
    let mut clk = clock::create_for_testing(scenario.ctx());

    // t=0: owner creates a vault
    clock::set_for_testing(&mut clk, 0);
    {
        vault::create_vault(
            string::utf8(b"Family documents"),
            GRACE_MS,
            &clk,
            scenario.ctx(),
        );
    };

    // Owner adds an heir
    scenario.next_tx(OWNER);
    {
        let mut v = scenario.take_shared<Vault>();
        vault::add_heir(&mut v, HEIR, scenario.ctx());
        assert!(vault::heirs(&v).contains(&HEIR), 1);
        // Not released yet: now (0) is not past grace.
        assert!(!vault::is_released(&v, &clk), 2);
        ts::return_shared(v);
    };

    // Time advances but still within grace → not released
    clock::set_for_testing(&mut clk, GRACE_MS); // exactly at threshold (not >)
    scenario.next_tx(HEIR);
    {
        let v = scenario.take_shared<Vault>();
        assert!(!vault::is_released(&v, &clk), 3);
        ts::return_shared(v);
    };

    // Time advances PAST grace → released
    clock::set_for_testing(&mut clk, GRACE_MS + 1);
    scenario.next_tx(HEIR);
    {
        let v = scenario.take_shared<Vault>();
        assert!(vault::is_released(&v, &clk), 4);
        ts::return_shared(v);
    };

    // Owner checks in → timer resets → not released again
    scenario.next_tx(OWNER);
    {
        let mut v = scenario.take_shared<Vault>();
        vault::check_in(&mut v, &clk, scenario.ctx());
        // last_checkin is now GRACE_MS+1, so release_at = 2*GRACE_MS+1
        assert!(!vault::is_released(&v, &clk), 5);
        ts::return_shared(v);
    };

    // Owner extends grace before travel (also resets timer)
    scenario.next_tx(OWNER);
    {
        let mut v = scenario.take_shared<Vault>();
        vault::set_grace_period(&mut v, GRACE_MS * 10, &clk, scenario.ctx());
        assert!(vault::grace_period_ms(&v) == GRACE_MS * 10, 6);
        ts::return_shared(v);
    };

    clock::destroy_for_testing(clk);
    scenario.end();
}

#[test, expected_failure(abort_code = vault::EAlreadyHeir)]
fun test_cannot_add_heir_twice() {
    let mut scenario = ts::begin(OWNER);
    let clk = clock::create_for_testing(scenario.ctx());
    {
        vault::create_vault(string::utf8(b"V"), GRACE_MS, &clk, scenario.ctx());
    };
    scenario.next_tx(OWNER);
    {
        let mut v = scenario.take_shared<Vault>();
        vault::add_heir(&mut v, HEIR, scenario.ctx());
        vault::add_heir(&mut v, HEIR, scenario.ctx()); // aborts
        ts::return_shared(v);
    };
    clock::destroy_for_testing(clk);
    scenario.end();
}

#[test, expected_failure(abort_code = vault::ENotOwner)]
fun test_stranger_cannot_check_in() {
    let mut scenario = ts::begin(OWNER);
    let clk = clock::create_for_testing(scenario.ctx());
    {
        vault::create_vault(string::utf8(b"V"), GRACE_MS, &clk, scenario.ctx());
    };
    scenario.next_tx(STRANGER);
    {
        let mut v = scenario.take_shared<Vault>();
        vault::check_in(&mut v, &clk, scenario.ctx()); // aborts
        ts::return_shared(v);
    };
    clock::destroy_for_testing(clk);
    scenario.end();
}
