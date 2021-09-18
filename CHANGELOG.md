

# Changelog

## 2.0 - September 18, 2021

### Added
- **freeCookies()** now supports passing an array of cookie names to free/set.

### Changed
- Codebase migration to TypeScript and code cleanup.
- Transition to a more modular architecture enabling functionality expansion in a cleaner way.
- All public facing API is accessed through the **FireGate.cookies** object.
- **attach()** function has been renamed to **startFiltering()**.
- **detach()** function has been renamed to **stopFiltering()**.
- **setPolicy()** function has been renamed to **setFilteringPolicy()**.
- **setFilteringPolicy()** won't check a policy's object structure validity.
- **freeCookies(true)** is now called as **freeCookies('all')**.
- **freeCookies(false)** is now called as **freeCookies('allowed')**.

<br>

## 1.0 - September 22, 2018
Version 1.0 is released.
