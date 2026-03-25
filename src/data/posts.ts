export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: Block[];
}

export type Block =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "code"; language: string; code: string }
  | { type: "list"; items: string[] };

export const posts: Post[] = [
  {
    slug: "getting-started-with-rust",
    title: "Getting started with Rust",
    date: "2026-03-15",
    excerpt: "A quick look at why Rust is worth learning and how to set up your first project.",
    content: [
      {
        type: "paragraph",
        text: "Rust has been voted the most loved programming language for several years in a row. But what makes it so compelling? It offers memory safety without a garbage collector, blazing fast performance, and a type system that catches entire classes of bugs at compile time.",
      },
      {
        type: "heading",
        text: "Installing Rust",
      },
      {
        type: "paragraph",
        text: "The easiest way to install Rust is via rustup, the official toolchain manager. Run the following in your terminal:",
      },
      {
        type: "code",
        language: "bash",
        code: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`,
      },
      {
        type: "heading",
        text: "Your first program",
      },
      {
        type: "paragraph",
        text: "Create a new project with Cargo, Rust's build tool and package manager:",
      },
      {
        type: "code",
        language: "bash",
        code: `cargo new hello_world\ncd hello_world\ncargo run`,
      },
      {
        type: "paragraph",
        text: "The generated src/main.rs already contains a hello world. Let's make it a bit more interesting:",
      },
      {
        type: "code",
        language: "rust",
        code: `fn main() {
    let name = "world";
    println!("Hello, {}!", name);

    // Ownership in action
    let s1 = String::from("hello");
    let s2 = s1; // s1 is moved, not copied
    println!("{}", s2);
}`,
      },
      {
        type: "paragraph",
        text: "The ownership system is one of Rust's most distinctive features. Once you internalize it, you'll find it guides you towards writing correct, efficient code naturally.",
      },
    ],
  },
  {
    slug: "css-grid-vs-flexbox",
    title: "CSS Grid vs Flexbox — when to use which",
    date: "2026-02-28",
    excerpt: "Both layout systems are powerful. Knowing which to reach for saves time and headaches.",
    content: [
      {
        type: "paragraph",
        text: "CSS Grid and Flexbox are both incredibly powerful layout tools, but they solve different problems. Understanding their strengths will make you a faster, more confident CSS author.",
      },
      {
        type: "heading",
        text: "Flexbox — one dimension",
      },
      {
        type: "paragraph",
        text: "Flexbox excels at distributing space along a single axis — either a row or a column. It's perfect for navigation bars, button groups, or centering content.",
      },
      {
        type: "code",
        language: "css",
        code: `.nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav a {
  padding: 0.5rem 1rem;
}`,
      },
      {
        type: "heading",
        text: "Grid — two dimensions",
      },
      {
        type: "paragraph",
        text: "Grid shines when you need to control both rows and columns simultaneously. Page layouts, card grids, and dashboard widgets are natural fits.",
      },
      {
        type: "code",
        language: "css",
        code: `.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.sidebar { grid-row: 1 / -1; }`,
      },
      {
        type: "heading",
        text: "Rule of thumb",
      },
      {
        type: "list",
        items: [
          "Use Flexbox when laying out items along a single axis.",
          "Use Grid when you need precise control over both axes.",
          "They compose well — a Grid cell can contain a Flex container.",
        ],
      },
    ],
  },
  {
    slug: "notes-on-note-taking",
    title: "Notes on note-taking",
    date: "2026-01-10",
    excerpt: "How I think about capturing ideas, why plain text still wins, and my current setup.",
    content: [
      {
        type: "paragraph",
        text: "I've tried every note-taking app imaginable. Notion, Obsidian, Roam, Bear, plain Markdown files, even a physical notebook. Each time I settle back into something simple. Here's why.",
      },
      {
        type: "heading",
        text: "The portability argument",
      },
      {
        type: "paragraph",
        text: "Plain text files are readable by any program, on any operating system, forever. Proprietary formats come and go. Your thoughts shouldn't depend on a startup staying solvent.",
      },
      {
        type: "heading",
        text: "My current setup",
      },
      {
        type: "list",
        items: [
          "A single ~/notes directory in a git repository.",
          "One Markdown file per topic, named with a date prefix.",
          "A tiny shell script that opens today's file in Neovim.",
          "Synced to a private remote — no cloud vendor lock-in.",
        ],
      },
      {
        type: "heading",
        text: "The shell script",
      },
      {
        type: "code",
        language: "bash",
        code: `#!/usr/bin/env bash
DATE=$(date +%Y-%m-%d)
FILE="$HOME/notes/$DATE.md"

if [ ! -f "$FILE" ]; then
  echo "# $DATE" > "$FILE"
fi

nvim "$FILE"`,
      },
      {
        type: "paragraph",
        text: "The best note-taking system is the one you actually use. Keep it boring. Keep it yours.",
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
