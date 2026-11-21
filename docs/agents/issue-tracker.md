# Issue tracker: GitHub

Issues and specs live at https://github.com/AlessandroRoic/GroceryAgent/issues.
Use the gh CLI from this repository.

## Operations

- Before creating an issue, verify the target with:
  gh repo view --json nameWithOwner
  Expected: AlessandroRoic/GroceryAgent.
- Create: gh issue create --title "..." --body-file <path>
- Read: gh issue view <number> --json number,title,body,labels,comments
- List: gh issue list --state open --json number,title,body,labels
- Comment: gh issue comment <number> --body-file <path>
- Label: gh issue edit <number> --add-label "<label>"
- Remove label: gh issue edit <number> --remove-label "<label>"
- Close: post the explanation as a comment, then gh issue close <number>.

Use a temporary UTF-8 file for multiline bodies and comments.
Use docs/agents/triage-labels.md for triage label names.

When a skill says "publish to the issue tracker", create a GitHub issue.
When it says "fetch the relevant ticket", read the referenced GitHub issue.

## Story points

When creating or estimating an implementation issue, set the agreed estimate in GitHub’s **Story points** single-select field. The supported options are `1`, `2`, `3`, and `5`. Older issues may mention points in their body or labels. Use the field for planning and PR checks.

Read the selected option with the GitHub CLI (replace `4` with the issue number):

```sh
gh api repos/AlessandroRoic/GroceryAgent/issues/4/issue-field-values --jq '.[] | select(.issue_field_name == "Story points" and .data_type == "single_select") | .single_select_option.name'
```

The option name is the estimate. The API’s numeric `value` is an option ID. If the command succeeds with no output, the issue has no visible estimate. Confirm the estimate and set it in the issue sidebar before using that issue as a PR’s primary issue. See the [engineering workflow](../engineering/workflow.md#scope-and-file-limits) for the corresponding file limit.

## Parent issues and dependencies

Use native GitHub sub-issues for parent-child relationships and native
issue dependencies for blockers. Run gh issue create --help or
gh issue edit --help for the installed CLI's flags.

If these features are unavailable, put "Part of #<parent>" and
"Blocked by: #<number>, #<number>" near the top of the child body.
An issue is unblocked when all its blockers are closed.

## Pull requests as a triage surface

PRs as a request surface: no.

## Wayfinding

- Map: one issue labelled wayfinder:map, containing Notes,
  Decisions-so-far, and Fog sections.
- Children: sub-issues labelled wayfinder:<type>, where type is
  research, prototype, grilling, or task.
- Frontier: open children with no open blockers and no assignee,
  in map order.
- Claim: assign the chosen issue to @me before working on it.
- Resolve: comment with the answer, close the child, then append
  a gist and link to the map's Decisions-so-far section.
- Create any missing wayfinder labels when that workflow is used.
