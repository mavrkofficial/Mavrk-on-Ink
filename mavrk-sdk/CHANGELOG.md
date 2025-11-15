Changelog

All notable changes will be documented in this file. This project adheres to semantic versioning.

Unreleased
- Simplified SDK surface to focus on three contracts: TokenFactory, TokenLocker, LinearVesting.
- TokenFactory now deploys with a provided NPM (DEX) address; removed tier-based param.
- Updated ABIs and wrappers for TokenLocker (newTokenLock/withdraw) and LinearVesting (preset options and claim).
- Removed Lens, Supabase, price/TVL features and related code/exports.
- Docs updated: README, QUICK_START, API_REFERENCE now match the slim API; removed emojis and marketing tone.
- Examples updated: deploy by NPM; locking example queries active locks.

Previous releases
- See repository history for earlier iterations prior to public SDK extraction.


