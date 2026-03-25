---
title: "Getting started with Rust"
date: "2026-03-15"
excerpt: "A quick look at why Rust is worth learning and how to set up your first project."
---

Rust has been voted the most loved programming language for several years in a row. But what makes it so compelling? It offers memory safety without a garbage collector, blazing fast performance, and a type system that catches entire classes of bugs at compile time.

## Installing Rust

The easiest way to install Rust is via rustup, the official toolchain manager. Run the following in your terminal:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

## Your first program

Create a new project with Cargo, Rust's build tool and package manager:

```bash
cargo new hello_world
cd hello_world
cargo run
```

The generated src/main.rs already contains a hello world. Let's make it a bit more interesting:

```rust
fn main() {
    let name = "world";
    println!("Hello, {}!", name);

    // Ownership in action
    let s1 = String::from("hello");
    let s2 = s1; // s1 is moved, not copied
    println!("{}", s2);
}
```

The ownership system is one of Rust's most distinctive features. Once you internalize it, you'll find it guides you towards writing correct, efficient code naturally.
