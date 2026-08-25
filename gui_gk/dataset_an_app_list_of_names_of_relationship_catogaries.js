// Key Design Principles
// Bidirectional: Every relationship should have an inverse (e.g., "contains" ↔ "is contained in")

// Cardinality-aware: Support one-to-one, one-to-many, many-to-many

// Context-specific: Same relationship type can mean different things in different contexts

// Validatable: Define allowed relationships for each entity type

// Extensible: Easy to add new relationship types

// Queryable: Support graph traversal and relationship discovery

// Metadata support: Allow additional attributes on relationships

// Version-aware: Support relationship lifecycle (deprecated, replaced by)

// dataset_an_app_v1_list_of_names_of_UNIVERSAL_SOFTWARE_RELATIONSHIPS_types

export const dataset_an_app_v1_list_of_names_of_UNIVERSAL_SOFTWARE_RELATIONSHIPS_hierarchical= [
    "contains",
    "is contained in",
    "parent of",
    "child of",
    "ancestor of",
    "descendant of",
    "root of",
    "leaf of",
    "nestled in",
    "encapsulates",
    "is part of",
    "comprises",
    "belongs to",
    "has member",
    "inherits from",
    "extends",
    "implements",
    "abstracts",
    "specializes"
  ]
 
export const dataset_an_app_v1_list_of_names_of_UNIVERSAL_SOFTWARE_RELATIONSHIPS_dependency = [
    "depends on",
    "is depended by",
    "requires",
    "is required by",
    "imports",
    "is imported by",
    "includes",
    "links to",
    "references",
    "is referenced by",
    "uses",
    "is used by",
    "calls",
    "is called by",
    "invokes",
    "is invoked by",
    "throws",
    "catches",
    "overrides",
    "overloaded by"
  ]


export const dataset_an_app_v1_list_of_names_of_UNIVERSAL_SOFTWARE_RELATIONSHIPS_data= [
    "has field",
    "has attribute",
    "has property",
    "has method",
    "has value",
    "has key",
    "has index",
    "points to",
    "references",
    "is linked to",
    "foreign key",
    "primary key",
    "unique key",
    "indexed by",
    "has relationship",
    "has many",
    "belongs to",
    "has one",
    "has and belongs to many",
    "aggregates",
    "composes",
    "associates with",
    "maps to"
  ]
 
export const dataset_an_app_v1_list_of_names_of_UNIVERSAL_SOFTWARE_RELATIONSHIPS_filesystem =  [
    "contains",
    "is in",
    "is parent of",
    "is child of",
    "is sibling of",
    "is root of",
    "is mounted on",
    "symbolic link to",
    "hard link to",
    "is alias of",
    "shortcut to",
    "backup of",
    "archive of",
    "extracted from",
    "compressed to",
    "encoded as",
    "decoded from"
  ]
export const dataset_an_app_v1_list_of_names_of_UNIVERSAL_SOFTWARE_RELATIONSHIPS_ui= [
    "contains",
    "is child of",
    "is sibling of",
    "precedes",
    "follows",
    "overlaps",
    "overlays",
    "is overlaid by",
    "adjacent to",
    "next to",
    "above",
    "below",
    "left of",
    "right of",
    "inside",
    "outside",
    "controls",
    "is controlled by",
    "triggers",
    "is triggered by",
    "updates",
    "is updated by",
    "renders",
    "is rendered by",
    "decorates",
    "styles",
    "is styled by",
    "validates",
    "is validated by"
  ]  

 export const dataset_an_app_v1_list_of_names_of_UNIVERSAL_SOFTWARE_RELATIONSHIPS_architecture= [
    "communicates with",
    "messages",
    "broadcasts to",
    "subscribes to",
    "publishes to",
    "listens on",
    "emits to",
    "consumes",
    "produces",
    "calls",
    "serves",
    "is served by",
    "routes to",
    "proxies",
    "load balances",
    "caches",
    "persists",
    "retrieves",
    "authenticates",
    "authorizes",
    "logs to",
    "monitors",
    "alerts"
  ]

  export const dataset_an_app_v1_list_of_names_of_UNIVERSAL_SOFTWARE_RELATIONSHIPS_process= [
    "precedes",
    "follows",
    "triggers",
    "is triggered by",
    "requires",
    "is required for",
    "generates",
    "takes as input",
    "transforms",
    "composes",
    "decomposes into",
    "parallel to",
    "sequential to",
    "branches to",
    "merges from",
    "loops through",
    "iterates over"
  ]
  

  export const dataset_an_app_v1_list_of_names_of_UNIVERSAL_SOFTWARE_RELATIONSHIPS_user= [
    "created by",
    "modified by",
    "owned by",
    "assigned to",
    "reported by",
    "approved by",
    "reviewed by",
    "shared with",
    "accessible to",
    "restricted from",
    "role of",
    "permission for",
    "likes",
    "comments on",
    "rates",
    "favorites",
    "follows"
  ]
  


  // Meta-relationships
  export const dataset_an_app_v1_list_of_names_of_UNIVERSAL_SOFTWARE_RELATIONSHIPS_meta= [
    "equivalent to",
    "opposite of",
    "related to",
    "similar to",
    "different from",
    "conflicts with",
    "compatible with",
    "incompatible with",
    "replaces",
    "is replaced by",
    "deprecates",
    "is deprecated by"
  ] 


  export const dataset_an_app_v1_list_of_names_of_UNIVERSAL_SOFTWARE_RELATIONSHIPS_catogaries = [
    "hierarchical",
    "dependency",    
    "data",
    "filesystem",
    "ui",
    "architecture",
    "process",
    "user",
    "meta"

  ]

export const RELATIONSHIP_CARDINALITY = [
    "one-to-one", "many-to-one", "many-to-many"
]

export const RELATIONSHIP_CARDINALITY = {
  "one-to-one": ["has one", "belongs to one", "maps to one"],
  "one-to-many": ["has many", "contains", "parent of"],
  "many-to-one": ["belongs to", "child of", "is contained in"],
  "many-to-many": ["has and belongs to many", "associates with", "references"]
};
