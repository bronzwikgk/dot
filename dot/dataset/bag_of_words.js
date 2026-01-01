/**
 * MASTER BAG OF WORDS DATASET
 * ============================
 * This comprehensive dataset contains ~1500+ words spanning multiple domains
 * for building a natural English scripting language with automation, AI, and
 * programming capabilities.
 */

const MASTER_BAG_OF_WORDS = [
  /**
   * ===========================================================================
   * SECTION 1: NATURAL LANGUAGE CORE
   * ===========================================================================
   * Basic English words for natural language processing
   */
  
  // === DECLARATION & ASSIGNMENT ===
  "let", "create", "make", "define", "declare", "initialize", "set", "assign",
  "establish", "instantiate", "construct", "build",
  
  // === ASSIGNMENT OPERATORS ===
  "is", "equals", "becomes", "gets", "=", "same", "identical",
  
  // === PREPOSITIONS & MODIFIERS ===
  "to", "as", "from", "by", "with", "of", "in", "on", "at", "for", "about",
  "above", "below", "under", "over", "between", "among", "through",
  
  // === VALUE & TYPE WORDS ===
  "value", "result", "output", "input", "parameter", "argument",
  "number", "integer", "float", "decimal", "double", "string", "text", "character",
  "boolean", "bool", "true", "false", "null", "undefined", "none", "nothing",
  "empty", "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  
  // === CONDITIONALS ===
  "if", "when", "whenever", "provided", "unless", "then", "else", "otherwise",
  "elseif", "elif",
  
  // === LOOP KEYWORDS ===
  "repeat", "while", "for", "times", "each", "every", "do", "end", "stop",
  "break", "continue", "pass", "iterate", "iteration",
  
  // === ARITHMETIC OPERATORS ===
  "plus", "add", "minus", "subtract", "remove", "times", "multiply", "divided",
  "divide", "over", "by", "modulo", "remainder", "mod", "div", "power", "exponent",
  "square", "cube", "root",
  
  // === COMPARISON OPERATORS ===
  "greater", "more", "larger", "bigger", "less", "smaller", "fewer", "equal",
  "different", "not", "than", "compared", "comparison",
  
  // === LOGICAL OPERATORS ===
  "and", "or", "but", "both", "either", "neither", "nor", "xor", "nand", "nor",
  
  // === BUILT-IN FUNCTIONS ===
  "print", "show", "display", "output", "log", "write", "input", "read", "ask",
  "get", "sum", "total", "average", "mean", "count", "length", "size",
  "concatenate", "join", "split",
  
  // === CONTROL FLOW ===
  "return", "exit", "quit", "stop", "yield", "goto",
  
  // === ARTICLES & PRONOUNS ===
  "the", "a", "an", "this", "that", "these", "those", "it", "they", "them",
  "their", "its", "our", "your", "my", "mine", "yours", "ours", "theirs",
  
  // === CONJUNCTIONS ===
  "which", "who", "whose", "whom", "where", "why", "how", "what", "whether",
  
  // === VERBS FOR OPERATIONS ===
  "calculate", "compute", "find", "store", "save", "load", "append", "remove",
  "delete", "clear", "reset", "update", "modify", "transform", "convert",
  "translate", "execute", "run", "perform", "implement",
  
  // === TIME & ITERATION ===
  "time", "times", "once", "twice", "thrice", "first", "last", "next", "previous",
  "now", "then", "after", "before", "during", "while",
  
  // === MATH CONSTANTS ===
  "pi", "e", "infinity", "nan", "phi", "golden", "ratio",
  
  // === PUNCTUATION MARKERS ===
  "period", "dot", "comma", "colon", "semicolon", "exclamation", "question",
  "quote", "quotation", "parenthesis", "bracket", "brace", "underscore", "dash",
  "hyphen",
  
  // === QUANTIFIERS ===
  "all", "every", "each", "any", "some", "many", "few", "several", "most",
  "least", "none", "no",
  
  // === COMMANDS ===
  "start", "begin", "run", "execute", "call", "invoke", "perform", "launch",
  "initiate",
  
  // === STATE WORDS ===
  "current", "previous", "next", "final", "initial", "original", "modified",
  "changed", "updated",
  
  // === VALIDATION WORDS ===
  "valid", "invalid", "correct", "incorrect", "exists", "missing", "present",
  "absent", "available", "unavailable",
  
  // === DIRECTIONAL ===
  "increase", "decrease", "increment", "decrement", "raise", "lower", "up",
  "down", "left", "right", "forward", "backward",
  
  // === COLLECTION OPERATIONS ===
  "contains", "includes", "has", "have", "index", "position", "item", "element",
  "member", "entry", "record",
  
  // === VERIFICATION ===
  "check", "verify", "test", "ensure", "confirm", "validate", "authenticate",
  "authorize",
  
  // === COMMON PROGRAMMING TERMS ===
  "function", "method", "procedure", "routine", "subroutine", "variable",
  "constant", "parameter", "argument", "result", "output", "input", "return",
  
  /**
   * ===========================================================================
   * SECTION 2: WEB SCRAPING & AUTOMATION
   * ===========================================================================
   * Keywords for web automation, scraping, and browser control
   */
  
  // === CORE SCRAPING CONCEPTS ===
  "scrape", "crawl", "spider", "bot", "crawler", "scraper", "parse", "extract",
  "harvest", "collect", "gather", "fetch", "download", "capture", "snapshot",
  "screenshot",
  
  // === WEB ELEMENTS & SELECTORS ===
  "html", "css", "selector", "xpath", "dom", "element", "tag", "attribute",
  "class", "id", "href", "src", "link", "button", "form", "input", "textarea",
  "select", "option", "table", "row", "column", "cell", "div", "span", "p",
  "header", "footer", "nav", "section", "article", "aside", "iframe", "canvas",
  "svg", "image", "img", "video", "audio", "source",
  
  // === BROWSER AUTOMATION ===
  "browser", "chrome", "firefox", "safari", "edge", "headless", "puppeteer",
  "selenium", "playwright", "cypress", "navigate", "goto", "click", "type",
  "fill", "submit", "scroll", "wait", "sleep", "timeout", "interval", "delay",
  "refresh", "reload", "back", "forward", "tab", "window", "popup", "alert",
  "dialog", "cookie", "localstorage", "sessionstorage",
  
  // === HTTP & NETWORKING ===
  "http", "https", "request", "response", "get", "post", "put", "delete", "patch",
  "header", "body", "payload", "json", "xml", "api", "endpoint", "url", "uri",
  "query", "parameter", "status", "code", "redirect", "proxy", "useragent",
  "referrer", "origin",
  
  // === DATA EXTRACTION ===
  "text", "content", "title", "description", "meta", "metadata", "price",
  "rating", "review", "date", "time", "author", "image", "thumbnail", "video",
  "download", "link", "url", "email", "phone", "address", "location",
  
  // === AUTOMATION PATTERNS ===
  "workflow", "pipeline", "sequence", "step", "task", "action", "trigger",
  "schedule", "cron", "interval", "periodic", "recurring", "one-time", "batch",
  "bulk", "mass",
  
  // === ROBOTICS PROCESS AUTOMATION ===
  "rpa", "automate", "robot", "process", "workflow", "orchestrate", "coordinate",
  "synchronize", "parallel", "sequential", "conditional", "branch", "merge",
  
  // === TEST AUTOMATION ===
  "test", "assert", "verify", "expect", "should", "must", "validate", "check",
  "coverage", "unit", "integration", "e2e", "end-to-end", "ui", "interface",
  "regression", "smoke", "sanity", "performance", "load", "stress",
  
  /**
   * ===========================================================================
   * SECTION 3: AI AGENT & WORKFLOW
   * ===========================================================================
   * Keywords for AI agents, workflows, and intelligent automation
   */
  
  // === AI AGENT CONCEPTS ===
  "agent", "ai", "artificial", "intelligence", "assistant", "bot", "chatbot",
  "conversational", "llm", "largelanguagemodel", "gpt", "openai", "anthropic",
  "claude", "bard", "copilot", "assistant", "helper", "guide", "advisor",
  "expert", "specialist",
  
  // === AGENT CAPABILITIES ===
  "reason", "think", "analyze", "understand", "comprehend", "interpret",
  "translate", "summarize", "explain", "describe", "generate", "create", "write",
  "compose", "edit", "rewrite", "paraphrase", "simplify", "elaborate", "expand",
  
  // === WORKFLOW AUTOMATION ===
  "workflow", "process", "orchestration", "coordination", "synchronization",
  "pipeline", "dag", "directedacyclicgraph", "node", "edge", "flow", "stream",
  "sequence", "parallel", "branch", "merge", "split", "join", "fork", "condition",
  "gateway", "decision", "event", "trigger", "schedule", "timer", "delay",
  
  // === AGENT COMMUNICATION ===
  "message", "chat", "conversation", "dialog", "prompt", "instruction", "command",
  "query", "question", "answer", "response", "reply", "feedback", "context",
  "memory", "history", "session", "thread",
  
  // === TOOL USE & INTEGRATION ===
  "tool", "plugin", "extension", "integration", "connector", "adapter", "api",
  "sdk", "library", "module", "package", "dependency", "service", "microservice",
  
  // === KNOWLEDGE & MEMORY ===
  "knowledge", "memory", "database", "vector", "embedding", "similarity",
  "search", "retrieve", "store", "recall", "remember", "forget", "context",
  "window", "limit", "token", "chunk",
  
  // === DECISION MAKING ===
  "decide", "choose", "select", "pick", "option", "alternative", "choice",
  "strategy", "policy", "rule", "logic", "reasoning", "inference", "deduction",
  "induction", "abduction",
  
  // === LEARNING & ADAPTATION ===
  "learn", "train", "fine-tune", "adapt", "adjust", "optimize", "improve",
  "evolve", "develop", "grow", "progress", "feedback", "reward", "penalty",
  "reinforcement",
  
  /**
   * ===========================================================================
   * SECTION 4: PROGRAMMING LANGUAGES
   * ===========================================================================
   * Keywords from major programming languages
   */
  
  // === JAVASCRIPT/ECMASCRIPT ===
  "var", "const", "let", "function", "async", "await", "promise", "then", "catch",
  "finally", "throw", "try", "class", "extends", "super", "this", "new",
  "instanceof", "typeof", "import", "export", "default", "from", "as", "yield",
  "generator", "constructor", "prototype", "get", "set", "static", "private",
  "public", "protected",
  
  // === PYTHON ===
  "def", "lambda", "class", "self", "init", "super", "import", "from", "as",
  "try", "except", "finally", "raise", "assert", "with", "global", "nonlocal",
  "pass", "del", "is", "in", "and", "or", "not", "True", "False", "None",
  "async", "await", "yield", "generator", "decorator", "@",
  
  // === C/C++ ===
  "int", "float", "double", "char", "bool", "void", "auto", "signed", "unsigned",
  "short", "long", "static", "extern", "register", "mutable", "const", "volatile",
  "if", "else", "switch", "case", "default", "break", "continue", "goto",
  "for", "while", "do", "return", "inline", "virtual", "override", "final",
  "public", "private", "protected", "friend", "template", "typename", "using",
  "namespace", "new", "delete", "sizeof", "typedef", "struct", "union", "enum",
  "class", "this", "operator", "throw", "try", "catch",
  
  // === JAVA ===
  "public", "private", "protected", "package", "import", "class", "interface",
  "extends", "implements", "abstract", "final", "static", "void", "int", "long",
  "float", "double", "boolean", "char", "byte", "short", "new", "this", "super",
  "if", "else", "switch", "case", "default", "for", "while", "do", "break",
  "continue", "return", "try", "catch", "finally", "throw", "throws", "assert",
  "synchronized", "volatile", "transient", "native", "strictfp",
  
  // === TYPESCRIPT ===
  "type", "interface", "enum", "namespace", "module", "declare", "as", "is",
  "keyof", "typeof", "readonly", "private", "protected", "public", "abstract",
  "implements", "extends", "in", "out", "infer",
  
  // === SHELL/BASH ===
  "echo", "cd", "ls", "pwd", "mkdir", "rm", "cp", "mv", "cat", "grep", "find",
  "sed", "awk", "chmod", "chown", "sudo", "su", "ps", "kill", "top", "df", "du",
  "tar", "zip", "unzip", "ssh", "scp", "wget", "curl", "ping", "ifconfig",
  
  /**
   * ===========================================================================
   * SECTION 5: DATA STRUCTURES & ALGORITHMS
   * ===========================================================================
   * Computer science fundamentals
   */
  
  // === DATA STRUCTURES ===
  "array", "list", "linkedlist", "stack", "queue", "deque", "priorityqueue",
  "heap", "tree", "binarytree", "bst", "avltree", "redblacktree", "graph",
  "hashmap", "hashtable", "dictionary", "map", "set", "hashset", "treeset",
  "bloomfilter", "trie", "segmenttree", "fenwicktree", "disjointset", "unionfind",
  
  // === ALGORITHMS ===
  "sort", "search", "binarysearch", "linearsearch", "bubblesort", "quicksort",
  "mergesort", "insertionsort", "selectionsort", "heapsort", "radixsort",
  "countingsort", "bucketsort", "dfs", "bfs", "dijkstra", "bellmanford",
  "floydwarshall", "prim", "kruskal", "knapsack", "dynamicprogramming", "dp",
  "backtracking", "recursion", "divide", "conquer", "greedy", "bruteforce",
  "slidingwindow", "twopointer",
  
  // === COMPLEXITY ANALYSIS ===
  "complexity", "bigo", "notation", "time", "space", "constant", "logarithmic",
  "linear", "linearithmic", "quadratic", "cubic", "exponential", "factorial",
  "optimal", "efficient", "performance", "scalability",
  
  /**
   * ===========================================================================
   * SECTION 6: SOFTWARE DEVELOPMENT & DEVOPS
   * ===========================================================================
   * Development workflow and operations
   */
  
  // === VERSION CONTROL ===
  "git", "commit", "push", "pull", "clone", "fork", "branch", "merge", "rebase",
  "cherrypick", "stash", "tag", "release", "version", "semver", "changelog",
  "pr", "pullrequest", "mr", "mergerequest", "code", "review",
  
  // === BUILD TOOLS ===
  "npm", "yarn", "pnpm", "webpack", "rollup", "vite", "parcel", "babel",
  "typescript", "tsc", "esbuild", "swc", "gradle", "maven", "ant", "make",
  "cmake", "docker", "dockerfile", "container", "image", "kubernetes", "k8s",
  "helm", "terraform", "ansible", "puppet", "chef",
  
  // === TESTING ===
  "test", "unit", "integration", "e2e", "endtoend", "ui", "api", "contract",
  "mutation", "property", "tdd", "bdd", "atdd", "assert", "expect", "mock",
  "stub", "spy", "fixture", "setup", "teardown", "before", "after", "each",
  "all", "describe", "it", "test", "suite", "runner", "coverage", "jest",
  "mocha", "jasmine", "karma", "cypress", "playwright", "selenium",
  
  // === CI/CD ===
  "ci", "cd", "continuous", "integration", "delivery", "deployment", "pipeline",
  "jenkins", "github", "actions", "gitlab", "cicd", "circleci", "travis",
  "azure", "devops", "argocd", "flux", "spinnaker", "deploy", "rollback",
  "bluegreen", "canary", "gradual",
  
  // === MONITORING & OBSERVABILITY ===
  "monitor", "log", "metric", "tracing", "alert", "dashboard", "grafana",
  "prometheus", "elk", "elastic", "kibana", "logstash", "splunk", "datadog",
  "newrelic", "apm", "uptime", "availability", "latency", "throughput", "error",
  "rate", "sla", "slo", "sl1",
  
  /**
   * ===========================================================================
   * SECTION 7: CLOUD & INFRASTRUCTURE
   * ===========================================================================
   * Cloud computing and infrastructure terms
   */
  
  // === CLOUD PROVIDERS ===
  "aws", "amazon", "web", "services", "azure", "microsoft", "gcp", "google",
  "cloud", "oracle", "cloud", "ibm", "cloud", "alibaba", "cloud", "digitalocean",
  "linode", "vultr", "heroku", "netlify", "vercel", "cloudflare",
  
  // === COMPUTE SERVICES ===
  "ec2", "lambda", "function", "serverless", "container", "eks", "ecs", "fargate",
  "vm", "virtual", "machine", "instance", "autoscaling", "loadbalancer", "elb",
  "alb", "nlb",
  
  // === STORAGE SERVICES ===
  "s3", "bucket", "object", "storage", "ebs", "efs", "fsx", "glacier", "rds",
  "database", "dynamodb", "aurora", "redshift", "elasticache", "memcached",
  "redis",
  
  // === NETWORKING ===
  "vpc", "subnet", "route", "table", "gateway", "nat", "security", "group",
  "acl", "vpn", "direct", "connect", "transit", "gateway", "cloudfront", "cdn",
  "waf", "shield", "firewall",
  
  /**
   * ===========================================================================
   * SECTION 8: DATABASES & DATA ENGINEERING
   * ===========================================================================
   * Database systems and data processing
   */
  
  // === DATABASE TYPES ===
  "sql", "nosql", "relational", "document", "keyvalue", "columnar", "graph",
  "timeseries", "inmemory", "new", "sql",
  
  // === DATABASE SYSTEMS ===
  "mysql", "postgresql", "postgres", "sqlite", "oracle", "sql", "server",
  "mongodb", "couchdb", "redis", "memcached", "cassandra", "hbase", "clickhouse",
  "druid", "elasticsearch", "solr", "neo4j", "arangodb", "dgraph",
  
  // === DATABASE OPERATIONS ===
  "select", "insert", "update", "delete", "where", "join", "inner", "outer",
  "left", "right", "full", "cross", "group", "by", "having", "order", "by",
  "limit", "offset", "distinct", "union", "intersect", "except", "index",
  "constraint", "primary", "key", "foreign", "unique", "check", "default",
  "transaction", "commit", "rollback", "savepoint", "isolation", "level",
  
  // === DATA PROCESSING ===
  "etl", "extract", "transform", "load", "elt", "batch", "stream", "real-time",
  "spark", "flink", "beam", "kafka", "rabbitmq", "pubsub", "message", "queue",
  "hadoop", "hdfs", "mapreduce", "hive", "pig", "presto", "trino",
  
  // === DATA WAREHOUSING ===
  "warehouse", "lake", "lakehouse", "delta", "iceberg", "hudi", "datamart",
  "olap", "oltp", "cube", "dimension", "fact", "measure", "star", "schema",
  "snowflake", "schema",
  
  /**
   * ===========================================================================
   * SECTION 9: SECURITY & COMPLIANCE
   * ===========================================================================
   * Security, authentication, and compliance terms
   */
  
  // === AUTHENTICATION & AUTHORIZATION ===
  "auth", "authentication", "authorization", "oauth", "openid", "connect", "jwt",
  "token", "bearer", "basic", "api", "key", "secret", "password", "hash", "salt",
  "bcrypt", "argon2", "pbkdf2", "certificate", "ssl", "tls", "pki", "mfa",
  "multifactor", "2fa", "biometric",
  
  // === SECURITY CONCEPTS ===
  "encryption", "decryption", "symmetric", "asymmetric", "rsa", "aes", "des",
  "cipher", "signature", "digest", "hmac", "firewall", "waf", "ids", "ips",
  "vulnerability", "exploit", "patch", "update", "malware", "virus", "trojan",
  "ransomware", "phishing", "social", "engineering",
  
  // === COMPLIANCE & GOVERNANCE ===
  "gdpr", "hipaa", "pci", "dss", "sox", "ccpa", "compliance", "audit", "policy",
  "governance", "risk", "management", "privacy", "pii", "personal", "information",
  "sensitive", "data",
  
  /**
   * ===========================================================================
   * SECTION 10: AI/ML & DATA SCIENCE
   * ===========================================================================
   * Artificial Intelligence, Machine Learning, and Data Science
   */
  
  // === MACHINE LEARNING ===
  "ml", "machine", "learning", "supervised", "unsupervised", "reinforcement",
  "regression", "linear", "logistic", "classification", "clustering", "kmeans",
  "hierarchical", "decision", "tree", "random", "forest", "svm", "neural",
  "network", "deep", "learning", "cnn", "rnn", "lstm", "transformer", "attention",
  "gan", "autoencoder",
  
  // === DATA SCIENCE ===
  "pandas", "numpy", "matplotlib", "seaborn", "plotly", "jupyter", "notebook",
  "colab", "kaggle", "tensorflow", "pytorch", "keras", "scikit", "learn", "xgboost",
  "lightgbm", "catboost", "feature", "engineering", "normalization", "scaling",
  "onehot", "encoding", "pipeline", "crossvalidation", "hyperparameter", "tuning",
  "gridsearch", "randomsearch",
  
  // === NATURAL LANGUAGE PROCESSING ===
  "nlp", "natural", "language", "processing", "tokenization", "stemming",
  "lemmatization", "stopwords", "tfidf", "word2vec", "glove", "bert", "gpt",
  "transformer", "sentiment", "analysis", "named", "entity", "recognition",
  "pos", "tagging", "parsing",
  
  // === COMPUTER VISION ===
  "cv", "computer", "vision", "opencv", "yolo", "fasterrcnn", "maskrcnn",
  "detection", "segmentation", "classification", "object", "recognition", "ocr",
  "optical", "character", "recognition",
  
  /**
   * ===========================================================================
   * SECTION 11: BUSINESS & PRODUCT MANAGEMENT
   * ===========================================================================
   * Business, product, and project management terms
   */
  
  // === PROJECT MANAGEMENT ===
  "agile", "scrum", "kanban", "waterfall", "sprint", "backlog", "epic", "story",
  "task", "bug", "issue", "ticket", "estimate", "velocity", "burndown", "chart",
  "retrospective", "standup", "daily", "planning", "review", "demo",
  
  // === PRODUCT MANAGEMENT ===
  "product", "roadmap", "feature", "requirement", "user", "story", "acceptance",
  "criteria", "mvp", "minimum", "viable", "product", "beta", "alpha", "release",
  "launch", "rollout", "feedback", "survey", "interview", "persona", "journey",
  "map",
  
  // === BUSINESS METRICS ===
  "kpi", "key", "performance", "indicator", "okr", "objective", "key", "result",
  "metric", "dashboard", "report", "analytics", "insight", "trend", "forecast",
  "prediction", "roi", "return", "on", "investment", "cac", "ltr", "churn", "rate",
  
  /**
   * ===========================================================================
   * SECTION 12: SYSTEM & HARDWARE
   * ===========================================================================
   * Operating systems, hardware, and low-level concepts
   */
  
  // === OPERATING SYSTEMS ===
  "linux", "windows", "macos", "unix", "ubuntu", "centos", "debian", "fedora",
  "kernel", "shell", "bash", "zsh", "terminal", "console", "command", "line",
  
  // === HARDWARE ===
  "cpu", "processor", "gpu", "graphics", "memory", "ram", "storage", "disk",
  "ssd", "hdd", "network", "nic", "motherboard", "bios", "uefi", "firmware",
  
  // === SYSTEM CONCEPTS ===
  "process", "thread", "multithreading", "concurrency", "parallelism", "mutex",
  "semaphore", "deadlock", "race", "condition", "synchronization", "memory",
  "management", "garbage", "collection", "heap", "stack", "pointer", "reference",
  "allocation", "deallocation",
  
  /**
   * ===========================================================================
   * SECTION 13: DOMAIN-SPECIFIC
   * ===========================================================================
   * Specialized domain vocabulary
   */
  
  // === BLOCKCHAIN & CRYPTO ===
  "blockchain", "bitcoin", "ethereum", "smart", "contract", "solidity", "web3",
  "defi", "nft", "token", "crypto", "cryptocurrency", "wallet", "mining",
  "consensus", "proof", "work", "stake", "transaction", "ledger", "distributed",
  
  // === IOT ===
  "iot", "internet", "things", "sensor", "actuator", "arduino", "raspberry",
  "pi", "esp32", "microcontroller", "embedded", "device", "edge", "computing",
  "mqtt", "coap",
  
  // === AR/VR ===
  "ar", "vr", "augmented", "virtual", "reality", "mixed", "reality", "oculus",
  "quest", "hololens", "metaverse", "3d", "modeling", "rendering", "unity",
  "unreal", "engine",
  
  // === QUANTUM COMPUTING ===
  "quantum", "computing", "qubit", "superposition", "entanglement", "interference",
  "quantumgate", "circuit", "qiskit", "cirq", "annealing", "optimization",
  
  /**
   * ===========================================================================
   * SECTION 14: MISC & UTILITY
   * ===========================================================================
   * Miscellaneous utility words and connectors
   */
  
  // === CONNECTORS ===
  "because", "since", "therefore", "thus", "hence", "so", "also", "too", "either",
  "neither", "however", "although", "though", "despite", "unless", "until",
  "while", "whereas",
  
  // === MODAL VERBS ===
  "can", "could", "may", "might", "will", "would", "shall", "should", "must",
  "ought", "to",
  
  // === INTENSIFIERS ===
  "very", "really", "extremely", "quite", "rather", "somewhat", "slightly",
  "fairly", "pretty", "too",
  
  // === NEGATORS ===
  "not", "no", "never", "none", "nothing", "nobody", "nowhere", "neither",
  "nor",
  
  // === QUANTITY WORDS ===
  "few", "little", "many", "much", "several", "some", "any", "all", "every",
  "each", "both", "either", "neither",
  
  // === TIME EXPRESSIONS ===
  "today", "tomorrow", "yesterday", "now", "then", "soon", "later", "early",
  "late", "always", "never", "often", "sometimes", "rarely", "usually",
  "frequently",
  
  // === PLACE EXPRESSIONS ===
  "here", "there", "where", "everywhere", "nowhere", "somewhere", "anywhere",
  "inside", "outside", "above", "below", "under", "over", "between", "among",
  
  // === MANNER EXPRESSIONS ===
  "how", "why", "when", "where", "what", "which", "who", "whom", "whose",
  
  // === FREQUENCY ADVERBS ===
  "always", "usually", "often", "sometimes", "rarely", "never", "frequently",
  "occasionally", "seldom", "hardly", "scarcely",
  
  // === DEGREE ADVERBS ===
  "completely", "totally", "absolutely", "utterly", "entirely", "perfectly",
  "quite", "rather", "fairly", "pretty", "somewhat", "slightly", "a", "little",
  "bit",
  
  // === SEQUENCE MARKERS ===
  "first", "second", "third", "next", "then", "after", "that", "finally",
  "lastly", "meanwhile", "simultaneously", "concurrently", "subsequently",
  "previously", "formerly",
  
  // === EXCLAMATIONS & INTERJECTIONS ===
  "oh", "ah", "wow", "oops", "hey", "hello", "hi", "please", "thank", "thanks",
  "sorry", "excuse", "me"
];

module.exports = MASTER_BAG_OF_WORDS;