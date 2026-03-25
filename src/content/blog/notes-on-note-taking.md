---
title: "Notes on note-taking"
date: "2026-01-10"
excerpt: "How I think about capturing ideas, why plain text still wins, and my current setup."
---

I've tried every note-taking app imaginable. Notion, Obsidian, Roam, Bear, plain Markdown files, even a physical notebook. Each time I settle back into something simple. Here's why.

## The portability argument

Plain text files are readable by any program, on any operating system, forever. Proprietary formats come and go. Your thoughts shouldn't depend on a startup staying solvent.

## My current setup

- A single ~/notes directory in a git repository.
- One Markdown file per topic, named with a date prefix.
- A tiny shell script that opens today's file in Neovim.
- Synced to a private remote — no cloud vendor lock-in.

## The shell script

```bash
#!/usr/bin/env bash
DATE=$(date +%Y-%m-%d)
FILE="$HOME/notes/$DATE.md"

if [ ! -f "$FILE" ]; then
  echo "# $DATE" > "$FILE"
fi

nvim "$FILE"
```

The best note-taking system is the one you actually use. Keep it boring. Keep it yours.
