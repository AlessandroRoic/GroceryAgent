# Frontend standards

## Vue code

- Group screens, components, composables, API modules, and tests by feature. Keep components, helpers, and tests in separate files within the feature.
- Write single-file components with `<script setup lang="ts">`. Use `PascalCase.vue` for components, `useSomething.ts` for composables, and `camelCase.ts` for other modules. Name components for their purpose, such as `ReceiptDraftReview.vue`.
- Keep rendering and simple event handlers in the component. Extract reusable reactive behavior to a composable, pure transformations to named helpers, and HTTP calls to the feature's API module. Start with local state and use shared state when screens need to coordinate. [Vue TypeScript guide](https://vuejs.org/guide/typescript/overview.html) · [API contracts](contracts.md)
- Limit each `.vue` file to **500 physical lines**, including template, script, styles, comments, and blank lines. Extract child components or move logic into composables or helpers according to responsibility. The pre-commit hook and CI enforce the limit.

## Component tests

Use Vue Testing Library to exercise visible behavior and the component's public interface. Render the component, interact with it as the household manager would, and assert the visible result or submitted value. Cover behavior such as editing a receipt quantity and seeing a validation message. Use the browser suite for workflows that cross screens or need persisted data.

- Find controls using `screen` and accessible roles and names or labels. Use visible text for static content and test IDs as a fallback. Scope queries with `within` when needed. Use semantic elements first and add ARIA where native semantics are insufficient.
- Use `getBy` for immediate presence, `findBy` when an element appears asynchronously, and `queryBy` for absence. Make assertions explicit and use DOM matchers such as `toBeDisabled()` and `toBeInTheDocument()`.
- Prefer `user-event` for realistic interaction and await asynchronous actions. Use `waitFor` with one specific assertion when a query cannot express the condition. Perform actions outside its callback.
- Use the runner's automatic cleanup. If a test needs a return value from `render`, destructure the specific method or refer to the result as `view`. Use the Testing Library helpers to render and interact, and resolve timing issues by awaiting their observable effect.
- Enable the applicable Testing Library and DOM matcher lint rules when wiring up the test suite.

Apply the DOM and interaction guidance from [Kent C. Dodds's Testing Library article](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library) using [Vue Testing Library](https://testing-library.com/docs/vue-testing-library/intro/) and its [query guidance](https://testing-library.com/docs/queries/about/). Use the [Vue testing guide](https://vuejs.org/guide/scaling-up/testing.html) for Vue-specific setup and behavior.

## Technical vocabulary

- **Form state** holds the values being edited on screen, including incomplete input and validation messages. For example, a receipt quantity field can be blank while it is being edited.
- **Composable** is a `useSomething` function that encapsulates reactive Vue behavior for reuse.

Use the root glossary for food and household terms and the contracts guide for shared data terms. [Domain docs](../agents/domain.md) · [API contracts](contracts.md)
