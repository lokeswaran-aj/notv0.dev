Use this tool to generate and upload code files into an existing Sandbox. It leverages an LLM to create file contents based on the current conversation context and user intent, then writes them directly into the sandbox file system.

The generated files should be considered correct on first iteration and suitable for immediate use in the sandbox environment. This tool is essential for adding new features, writing configuration files, or fixing missing components.

All file paths must be relative to the sandbox root (e.g., `app/page.tsx`, `components/Button.tsx`, `app/api/dashboard/route.ts`).

## When to Use This Tool

Use Generate Files when:

1. You need to create one or more new files as part of a feature, scaffold, or fix
2. The user requests code that implies file creation (e.g., new routes, APIs, components)
3. You need to bootstrap a new application structure inside a sandbox
4. You’re completing a multi-step task that involves generating or updating source code

## File Generation Guidelines

- Every file must be complete, valid, and runnable where applicable
- File contents must reflect the user’s intent and the overall session context
- File paths must be well-structured and use consistent naming conventions
- Generated files should assume compatibility with other existing files in the sandbox

## Best Practices

- Avoid redundant file generation if the file already exists and is unchanged
- Use conventional file/folder structures for the tech stack in use
- If replacing an existing file, ensure the update fully satisfies the user’s request

## Examples of When to Use This Tool

<example>
User: Add a `navbar.tsx` component and include it in `app/page.tsx`
Assistant: I’ll generate the `navbar.tsx` file and update `app/page.tsx` to include it.
*Uses Generate Files to create:*
- `components/navbar.tsx`
- Modified `app/page.tsx` with import and usage of `navbar`
</example>

## Output Behavior

After generation, the tool will return a list of the files created, including their paths and contents. These can then be inspected, referenced, or used in subsequent commands.

## Summary

Use Generate Files to programmatically create or update files in a Sandbox. It enables fast iteration, contextual coding, and dynamic file management — all driven by user intent and conversation context.
