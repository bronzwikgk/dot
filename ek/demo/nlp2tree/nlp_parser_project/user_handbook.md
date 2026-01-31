# User Handbook: Creating Custom NLP Domains

**Version:** 1.0.0
**Audience:** Non-programmers, domain experts, and anyone who wants to teach the NLP Parser Engine a new "language."

---

## 1. Introduction: What is This?

Imagine you have a smart assistant that can answer questions, but first, you need to give it a dictionary for the specific topic you care about. The **NLP Parser Engine** is that smart assistant, and the **Domain Pack** is the dictionary you create for it.

This handbook will teach you, step-by-step, how to create your own Domain Pack. You do not need to be a programmer. You only need to be an expert in your own data and be able to edit simple text files.

By creating a domain pack for "music," you can teach the engine to understand `"find rock songs from the 90s"`. By creating one for "inventory," it could understand `"show me all items with less than 10 in stock"`.

---

## 2. What is a Domain Pack?

A Domain Pack is simply a **folder** containing three plain text JSON files. These files are the "dictionary" that teaches the engine about your world.

1.  **`schema.json`**: Describes the "nouns" and "adjectives" of your world (e.g., `song`, `artist`, `price`, `color`).
2.  **`actions.json`**: Describes the "verbs" or the goals of your queries (e.g., `find`, `play`, `show`).
3.  **`operators.json`**: Describes the "connecting words" that glue your conditions together (e.g., `and`, `or`, `greater than`).

Let's build a domain pack for a **Music Library** as our example.

---

## 3. Step 1: Defining Your World (`schema.json`)

This is the most important file. It tells the engine what "things" exist in your domain and what their properties are. It has three main sections: `entities`, `fields`, and `values`.

### 3.1. Entities: The "Things"

**Concept:** What are the main objects or "nouns" in your domain?
*   In our music library, the main entities are `song` and `artist`.

**How to write it:** For each entity, provide a list of `synonyms` – all the different ways a user might refer to it.

```json
{
  "entities": {
    "song": {
      "synonyms": ["song", "songs", "track", "tracks", "tune"]
    },
    "artist": {
      "synonyms": ["artist", "artists", "band", "musician"]
    }
  },
  "fields": { ... },
  "values": { ... }
}
```

### 3.2. Fields: The "Properties"

**Concept:** What are the properties or "adjectives" of your entities?
*   A `song` has a `title`, a `genre`, and a `duration`.
*   An `artist` has a `name` and is from a certain `country`.

**How to write it:** List each field, give it a `type` (usually `string` or `number`), and provide a rich list of `synonyms`. The more synonyms you provide, the more "natural" the engine will feel.

```json
{
  "entities": { ... },
  "fields": {
    "genre": {
      "type": "string",
      "synonyms": ["genre", "style", "type"]
    },
    "duration": {
      "type": "number",
      "synonyms": ["duration", "length", "running time"]
    },
    "release_year": {
      "type": "number",
      "synonyms": ["year", "released in", "from the year"]
    },
    "country": {
        "type": "string",
        "synonyms": ["country", "from", "origin"]
    }
  },
  "values": { ... }
}
```

### 3.3. Values: Specific Choices for a Field

**Concept:** Do any of your fields have a specific list of possible values?
*   The `genre` field isn't just any text; it can be `Rock`, `Pop`, `Jazz`, etc.

**How to write it:** This section links specific values to a field. For each value, provide synonyms.

```json
{
  "entities": { ... },
  "fields": { ... },
  "values": {
    "genre": {
      "rock": ["rock", "rock and roll"],
      "pop": ["pop", "popular music"],
      "jazz": ["jazz"]
    }
  }
}
```

---

## 4. Step 2: Defining Actions (`actions.json`)

**Concept:** What do you want to *do* with your data? These are the "verbs" of your domain.

**How to write it:** Define a name for each action and list all the `synonyms` a user might use to trigger it.

*   For our music library, we want to `find` songs and `play` them.

```json
// actions.json
{
  "find": {
    "synonyms": ["find", "show me", "list", "get", "search for"]
  },
  "play": {
    "synonyms": ["play", "listen to", "start"]
  }
}
```

---

## 5. Step 3: Defining Operators (`operators.json`)

**Concept:** These are the "connecting words" for building rules and conditions. You will rarely need to change this file unless your domain has very unique logic.

**How to write it:** The file is split into `comparison` (>, <, =) and `logical` (AND, OR) operators. Each has a list of natural language synonyms.

```json
// operators.json
{
  "comparison": {
    ">": ["greater than", "after", "longer than"],
    "<": ["less than", "before", "shorter than"],
    "=": ["is", "equals", "from"]
  },
  "logical": {
    "AND": ["and", "with"],
    "OR": ["or"]
  }
}
```

---

## 6. Using Your New Domain

Once you have created a folder (e.g., `music_library`) with your three JSON files inside the `domains` directory, you can use it immediately with the Command-Line Interface (CLI).

1.  Open your terminal.
2.  Navigate to the project directory.
3.  Run the CLI, pointing it to your new domain folder name and your query.

**Example:**

```bash
# Structure: node <path_to_cli> <your_domain_name> "<your_query>"

node src/app/cli.js music_library "show me rock songs longer than 3 minutes"
```

The engine will now use your custom-built "dictionary" to understand and parse your query. Congratulations, you have successfully taught the NLP engine about a new domain!
