# Change Log

All notable changes to the "suscode" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file
and adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] 2024-08-29

### Add
- PATCH VirusTotal API
- MAJOR database option with login to save scan history
- MAJOR add more testing
- MINOR select all option
- MINOR single scan window with additional scans
- MINOR additional scan patterns

### Change
- PATCH visual loading for scans in progress

### Fix

## [1.0.0] - 2024-09-12

### Added

### Changed

### Fixed
- Optimized readme description in tabs


## [0.0.3] - 2024-09-11

### Added

### Changed
- Optimized telemtry results
- Optimized package dependency results

### Fixed
- json package modifications


## [0.0.2] - 2024-09-10

### Added
- Pattern Dictionary
- Description finder for downloaded extensions
- Additional scan for telemetry 
- Additional scan for package dependencies

### Changed
- Moved each extension to one panel with tabs for selected extensions
- Frontend modularization
- State management to retain panels
- ReadMe update

### Fixed
- Organization of source code

## [0.0.1] - 2024-08-29

### Added
- Grabs user's downloaded extensions file
- Pattern matching for invoked functions
- Panel with list of extensions
- Webview panel for each extension
- MUI used for styling

### Changed
- Switch to Webpack from Vite
- Modularized using React