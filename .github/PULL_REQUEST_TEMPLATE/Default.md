# Description of Changes

(A basic summary of the changes. Include screenshots for UI changes.)

# Guideline Checklist

- **Quality**
  - [ ] Unit tests cover >=80% of code
  - [ ] Browsers (Chrome, Safari, Firefox)
  - [ ] Responsive (mobile, tablet, small desktop 1280px, wrapping)
  - [ ] Accessible (Mac VoiceOver, LevelAccess)
  - [ ] Branch logic (edge cases, empty states, error states, etc.)
  - [ ] Secure (meets security standards)
- [ ] **Orthogonal:** New packages have one clear and specific purpose. Packages should be easily pluggable in a variety of scenarios and maintain a separation of concerns.
- [ ] **Strongly Typed:** Changes provide TypeScript typings for consumers where applicable.
- [ ] **Changelog:** For each change that would cause a semantic version update to a package, changesets are provided.
- [ ] **Documentation:** Changes are appropriately documented for consumers
- [ ] **Smart Defaults:** When configuration is provided, changes provide smart default, yet allow for maximum customization of underlying technologies. For example, an access logging package covers most use cases, but should allow for adding or removing fields.
