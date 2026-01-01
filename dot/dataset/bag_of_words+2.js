// file-folder-operations-bag-of-words.js

const FILE_FOLDER_OPERATIONS_WORDS = [
  /**
   * ===========================================================================
   * FILE SYSTEM OPERATIONS
   * ===========================================================================
   */
  
  // === FILE OPERATIONS ===
  "file", "files", "filename", "filepath", "path", "directory", "folder",
  "subfolder", "subdirectory", "parent", "child", "root", "home", "desktop",
  "documents", "downloads", "pictures", "videos", "music", "temp", "temporary",
  "cache", "config", "configuration", "settings", "preferences", "log", "logs",
  
  // === FILE ACTIONS ===
  "create", "new", "make", "delete", "remove", "erase", "trash", "recycle",
  "copy", "duplicate", "clone", "move", "rename", "reorganize", "rearrange",
  "sort", "organize", "arrange", "group", "ungroup", "compress", "zip", "unzip",
  "extract", "archive", "pack", "unpack", "tar", "gzip", "bzip", "7zip",
  
  // === FILE PERMISSIONS ===
  "permission", "permissions", "read", "write", "execute", "chmod", "chown",
  "chgrp", "umask", "access", "accessible", "locked", "unlocked", "hidden",
  "visible", "show", "hide", "reveal", "expose",
  
  // === FILE SEARCH ===
  "find", "search", "locate", "discover", "grep", "findstr", "where", "which",
  "locate", "pattern", "wildcard", "regex", "glob", "match", "filter", "exclude",
  "include", "recursive", "depth", "level",
  
  // === FILE VIEWING ===
  "open", "close", "view", "preview", "read", "cat", "type", "more", "less",
  "head", "tail", "watch", "monitor", "stream", "display", "show", "list", "ls",
  "dir", "tree", "structure", "hierarchy", "contents",
  
  // === FILE EDITING ===
  "edit", "modify", "update", "change", "append", "prepend", "insert", "replace",
  "sed", "awk", "vi", "vim", "nano", "emacs", "editor", "textedit", "notepad",
  "ide", "code", "editor",
  
  // === FILE COMPARISON ===
  "compare", "diff", "difference", "similar", "identical", "same", "different",
  "changed", "unchanged", "merge", "conflict", "resolve", "patch", "apply",
  
  // === FILE BACKUP ===
  "backup", "restore", "recover", "undo", "redo", "version", "revision",
  "snapshot", "incremental", "full", "differential", "sync", "synchronize",
  "rsync", "robocopy", "xcopy", "scp", "ftp", "sftp",
  
  // === FILE TYPES ===
  "txt", "text", "csv", "json", "xml", "yaml", "yml", "html", "htm", "css",
  "js", "javascript", "py", "python", "java", "class", "cpp", "c", "h", "header",
  "php", "rb", "ruby", "go", "rs", "rust", "ts", "typescript", "sql", "db",
  "database", "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "jpg", "jpeg",
  "png", "gif", "bmp", "svg", "mp3", "mp4", "avi", "mov", "wmv", "zip", "rar",
  "tar", "gz", "7z", "exe", "msi", "dmg", "pkg", "deb", "rpm", "iso", "img",
  
  /**
   * ===========================================================================
   * FOLDER/DIRECTORY OPERATIONS
   * ===========================================================================
   */
  
  // === FOLDER ACTIONS ===
  "mkdir", "rmdir", "directory", "folder", "subdirectory", "subfolder",
  "navigate", "cd", "chdir", "pushd", "popd", "pwd", "current", "working",
  "relative", "absolute", "pathname", "fullpath", "shortpath", "unc", "path",
  
  // === FOLDER MANAGEMENT ===
  "organize", "structure", "hierarchy", "tree", "flat", "nested", "depth",
  "breadth", "recursive", "iterative", "traverse", "walk", "explore", "browse",
  "scan", "crawl", "index", "catalog", "inventory", "list", "enumerate",
  
  // === FOLDER PERMISSIONS ===
  "shared", "private", "public", "protected", "restricted", "access", "grant",
  "revoke", "share", "sharing", "collaborate", "collaboration", "team", "group",
  "user", "owner", "administrator", "admin", "superuser", "root", "sudo",
  
  // === FOLDER SYNC ===
  "sync", "synchronize", "mirror", "clone", "copy", "replicate", "duplicate",
  "backup", "restore", "cloud", "onedrive", "googledrive", "dropbox", "icloud",
  "network", "nas", "san", "storage", "remote", "local",
  
  /**
   * ===========================================================================
   * DISK & STORAGE OPERATIONS
   * ===========================================================================
   */
  
  // === STORAGE MANAGEMENT ===
  "disk", "drive", "volume", "partition", "format", "filesystem", "ntfs",
  "fat32", "exfat", "ext4", "apfs", "hfs", "zfs", "btrfs", "mount", "unmount",
  "eject", "dismount", "removable", "external", "internal", "usb", "flash",
  "ssd", "hdd", "raid", "striping", "mirroring", "parity",
  
  // === DISK SPACE ===
  "space", "capacity", "size", "used", "free", "available", "quota", "limit",
  "threshold", "warning", "alert", "cleanup", "clean", "purge", "empty",
  "trash", "recycle", "bin", "temporary", "cache", "clear", "freeup",
  
  // === DISK UTILITIES ===
  "defragment", "optimize", "repair", "check", "chkdsk", "fsck", "diskpart",
  "fdisk", "gparted", "format", "quickformat", "fullformat", "lowlevel",
  
  /**
   * ===========================================================================
   * NETWORK FILE OPERATIONS
   * ===========================================================================
   */
  
  // === NETWORK SHARES ===
  "share", "network", "unc", "smb", "cifs", "nfs", "afp", "webdav", "ftp",
  "sftp", "ftps", "ssh", "scp", "rsync", "mapped", "drive", "letter", "mount",
  "unmount", "credentials", "username", "password", "domain", "workgroup",
  
  // === CLOUD STORAGE ===
  "cloud", "onedrive", "googledrive", "dropbox", "box", "icloud", "mega",
  "nextcloud", "owncloud", "sync", "upload", "download", "stream", "share",
  "link", "public", "private", "encrypted", "versioned", "revision",
  
  // === TRANSFER PROTOCOLS ===
  "ftp", "sftp", "ftps", "scp", "rsync", "http", "https", "webdav", "torrent",
  "p2p", "peer", "seed", "leech", "bandwidth", "throttle", "limit", "speed",
  
  /**
   * ===========================================================================
   * FILE METADATA & PROPERTIES
   * ===========================================================================
   */
  
  // === BASIC PROPERTIES ===
  "name", "filename", "extension", "type", "size", "bytes", "kb", "mb", "gb",
  "tb", "pb", "created", "modified", "accessed", "date", "time", "timestamp",
  "owner", "group", "permissions", "attributes", "hidden", "readonly", "system",
  "archive", "compressed", "encrypted",
  
  // === CONTENT PROPERTIES ===
  "encoding", "utf8", "utf16", "ascii", "binary", "text", "line", "lines",
  "word", "words", "character", "characters", "paragraph", "pages", "empty",
  "nonempty", "valid", "invalid", "corrupt", "corrupted", "damaged", "healthy",
  
  // === MEDIA PROPERTIES ===
  "resolution", "dimension", "width", "height", "dpi", "ppi", "color", "depth",
  "bitrate", "samplerate", "duration", "length", "framerate", "codec", "format",
  "container", "metadata", "exif", "iptc", "xmp",
  
  /**
   * ===========================================================================
   * BATCH & BULK OPERATIONS
   * ===========================================================================
   */
  
  // === BATCH PROCESSING ===
  "batch", "bulk", "mass", "multiple", "selected", "all", "everything", "each",
  "every", "recursive", "subfolders", "include", "exclude", "filter", "pattern",
  "wildcard", "regex", "glob", "match", "case", "sensitive", "insensitive",
  
  // === AUTOMATION SCRIPTS ===
  "script", "batch", "shell", "bash", "powershell", "python", "automate",
  "scheduled", "task", "cron", "tasker", "automator", "workflow", "macro",
  "shortcut", "alias", "symlink", "junction", "hardlink", "softlink",
  
  // === TRANSFORMATION PIPELINES ===
  "pipeline", "process", "transform", "convert", "resize", "optimize", "compress",
  "watermark", "rename", "reformat", "transcode", "encode", "decode", "extract",
  "combine", "merge", "split", "join", "concatenate",
  
  /**
   * ===========================================================================
   * FILE SECURITY & ENCRYPTION
   * ===========================================================================
   */
  
  // === ENCRYPTION ===
  "encrypt", "decrypt", "cipher", "aes", "des", "blowfish", "rsa", "pgp", "gpg",
  "password", "passphrase", "key", "private", "public", "certificate", "sign",
  "verify", "signature", "hash", "md5", "sha1", "sha256", "sha512", "checksum",
  
  // === SECURITY ACTIONS ===
  "lock", "unlock", "protect", "secure", "hide", "reveal", "obfuscate", "mask",
  "redact", "sanitize", "clean", "scrub", "wipe", "shred", "erase", "securedelete",
  "quarantine", "isolate", "sandbox",
  
  // === PERMISSION MANAGEMENT ===
  "acl", "accesscontrollist", "dac", "mac", "rbac", "role", "based", "policy",
  "rule", "allow", "deny", "grant", "revoke", "inherit", "propagate", "reset",
  
  /**
   * ===========================================================================
   * FILE ORGANIZATION PATTERNS
   * ===========================================================================
   */
  
  // === ORGANIZATION METHODS ===
  "sort", "order", "arrange", "group", "categorize", "tag", "label", "color",
  "flag", "star", "favorite", "bookmark", "pin", "priority", "important",
  "urgent", "todo", "done", "pending", "review", "archive", "trash",
  
  // === NAMING CONVENTIONS ===
  "rename", "prefix", "suffix", "counter", "sequence", "timestamp", "date",
  "time", "version", "revision", "draft", "final", "backup", "copy", "old",
  "new", "temp", "temporary", "working", "final", "approved", "rejected",
  
  // === FOLDER STRUCTURES ===
  "hierarchy", "tree", "flat", "nested", "modular", "monolithic", "bytype",
  "bydate", "byproject", "byclient", "bycategory", "alphabetical", "chronological",
  "size", "type", "extension",
  
  /**
   * ===========================================================================
   * FILE INTEGRITY & VALIDATION
   * ===========================================================================
   */
  
  // === INTEGRITY CHECKS ===
  "verify", "validate", "check", "test", "integrity", "corruption", "damage",
  "healthy", "broken", "repair", "fix", "recover", "restore", "backup",
  "snapshot", "version", "compare", "diff", "identical", "changed",
  
  // === VALIDATION TOOLS ===
  "checksum", "hash", "md5sum", "shasum", "crc", "parity", "error", "correcting",
  "ecc", "raid", "mirror", "redundant", "backup", "archive", "log", "audit",
  "trail", "history",
  
  /**
   * ===========================================================================
   * FILE SEARCH & INDEXING
   * ===========================================================================
   */
  
  // === SEARCH TECHNIQUES ===
  "search", "find", "locate", "discover", "grep", "findstr", "ack", "ag",
  "ripgrep", "fzf", "everything", "spotlight", "windowssearch", "locate",
  "updatedb", "index", "catalog", "database", "metadata", "tag", "keyword",
  
  // === SEARCH CRITERIA ===
  "name", "content", "text", "inside", "metadata", "date", "size", "type",
  "extension", "modified", "created", "accessed", "owner", "permissions",
  "attributes", "recursive", "case", "sensitive", "regex", "wildcard", "glob",
  
  /**
   * ===========================================================================
   * FILE COMPRESSION & ARCHIVING
   * ===========================================================================
   */
  
  // === COMPRESSION FORMATS ===
  "zip", "rar", "7z", "tar", "gz", "gzip", "bzip2", "xz", "lzma", "zstd",
  "archive", "compressed", "packed", "extract", "unpack", "decompress", "inflate",
  "deflate", "ratio", "compression", "level", "fast", "best", "normal",
  
  // === ARCHIVE OPERATIONS ===
  "create", "extract", "list", "test", "repair", "update", "add", "remove",
  "delete", "password", "encrypt", "split", "join", "volume", "part", "segment",
  
  /**
   * ===========================================================================
   * FILE SYNCHRONIZATION
   * ===========================================================================
   */
  
  // === SYNC OPERATIONS ===
  "sync", "synchronize", "mirror", "clone", "copy", "replicate", "backup",
  "restore", "rsync", "robocopy", "xcopy", "scp", "ftp", "sftp", "webdav",
  "onedrive", "googledrive", "dropbox", "cloud", "local", "remote",
  
  // === SYNC OPTIONS ===
  "bidirectional", "unidirectional", "oneway", "twoway", "incremental", "full",
  "differential", "real-time", "manual", "scheduled", "onchange", "trigger",
  "event", "watcher", "monitor", "detect", "conflict", "resolve", "merge",
  
  /**
   * ===========================================================================
   * FILE VERSIONING & HISTORY
   * ===========================================================================
   */
  
  // === VERSION CONTROL ===
  "version", "revision", "history", "snapshot", "backup", "restore", "undo",
  "redo", "rollback", "revert", "previous", "older", "newer", "latest",
  "current", "delta", "change", "diff", "patch", "merge", "conflict",
  
  // === VERSIONING SYSTEMS ===
  "git", "svn", "mercurial", "cvs", "perforce", "backup", "shadow", "copy",
  "timeshift", "snapshot", "restorepoint", "systemrestore", "versioning",
  
  /**
   * ===========================================================================
   * FILE PREVIEW & THUMBNAILS
   * ===========================================================================
   */
  
  // === PREVIEW OPERATIONS ===
  "preview", "thumb", "thumbnail", "icon", "view", "quicklook", "peek", "hover",
  "previewpane", "details", "properties", "info", "metadata", "exif", "iptc",
  
  // === PREVIEW TYPES ===
  "image", "document", "pdf", "video", "audio", "text", "code", "spreadsheet",
  "presentation", "3d", "model", "font", "archive", "email", "message",
  
  /**
   * ===========================================================================
   * FILE SHARING & COLLABORATION
   * ===========================================================================
   */
  
  // === SHARING METHODS ===
  "share", "link", "url", "qr", "code", "email", "message", "chat", "team",
  "channel", "workspace", "collaborate", "collaboration", "coedit", "coauthor",
  "simultaneous", "realtime", "comments", "annotations", "markup", "review",
  
  // === PERMISSION LEVELS ===
  "view", "edit", "comment", "owner", "admin", "manager", "editor", "viewer",
  "guest", "anonymous", "authenticated", "domain", "organization", "team",
  "group", "individual",
  
  /**
   * ===========================================================================
   * FILE AUTOMATION & WORKFLOWS
   * ===========================================================================
   */
  
  // === AUTOMATION TRIGGERS ===
  "oncreate", "onmodify", "ondelete", "onrename", "onmove", "oncopy", "when",
  "if", "condition", "rule", "trigger", "event", "schedule", "cron", "timer",
  "interval", "daily", "weekly", "monthly", "startup", "login", "logout",
  
  // === AUTOMATION ACTIONS ===
  "move", "copy", "rename", "delete", "compress", "encrypt", "backup", "sync",
  "notify", "email", "alert", "log", "execute", "run", "script", "command",
  "workflow", "pipeline", "process", "transform",
  
  /**
   * ===========================================================================
   * FILE RECOVERY & UNDELETE
   * ===========================================================================
   */
  
  // === RECOVERY OPERATIONS ===
  "recover", "undelete", "restore", "backup", "recycle", "bin", "trash",
  "temporary", "cache", "shadow", "copy", "version", "previous", "snapshot",
  "backup", "archive", "log", "history",
  
  // === RECOVERY TOOLS ===
  "recuva", "testdisk", "photorec", "easeus", "stellar", "rstudio", "getdataback",
  "recovery", "tool", "software", "utility", "scan", "deepscan", "raw", "carve",
  
  /**
   * ===========================================================================
   * FILE MONITORING & AUDITING
   * ===========================================================================
   */
  
  // === MONITORING OPERATIONS ===
  "watch", "monitor", "audit", "log", "track", "trace", "record", "history",
  "changes", "modifications", "access", "reads", "writes", "deletes", "renames",
  "moves", "copies", "permissions", "ownership",
  
  // === AUDITING TOOLS ===
  "audit", "log", "event", "viewer", "security", "syslog", "journal", "system",
  "application", "file", "integrity", "monitoring", "fim", "tripwire", "aide",
  "ossec", "wazuh",
  
  /**
   * ===========================================================================
   * FILE DUPLICATE FINDING
   * ===========================================================================
   */
  
  // === DUPLICATE OPERATIONS ===
  "duplicate", "copy", "identical", "same", "similar", "content", "name",
  "size", "hash", "checksum", "md5", "sha", "find", "locate", "identify",
  "mark", "select", "delete", "remove", "keep", "newest", "oldest", "largest",
  "smallest",
  
  // === DUPLICATE TOOLS ===
  "dupeguru", "fslint", "auslogics", "duplicate", "finder", "cleaner", "cleanup",
  "space", "saver", "optimizer", "organizer",
  
  /**
   * ===========================================================================
   * FILE TAGGING & METADATA
   * ===========================================================================
   */
  
  // === TAGGING OPERATIONS ===
  "tag", "label", "category", "keyword", "metadata", "property", "attribute",
  "custom", "standard", "exif", "iptc", "xmp", "id3", "rating", "star", "flag",
  "color", "comment", "note", "description", "author", "copyright", "license",
  
  // === TAGGING TOOLS ===
  "tagger", "metadata", "editor", "exiftool", "mp3tag", "picard", "digikam",
  "photomechanic", "lightroom", "bridge", "catalog", "library", "database",
  
  /**
   * ===========================================================================
   * FILE CONVERSION & TRANSCODING
   * ===========================================================================
   */
  
  // === CONVERSION OPERATIONS ===
  "convert", "transcode", "encode", "decode", "transform", "change", "format",
  "type", "extension", "resolution", "size", "quality", "bitrate", "samplerate",
  "codec", "container", "preset", "profile", "fast", "normal", "high", "best",
  
  // === CONVERSION TOOLS ===
  "ffmpeg", "imagemagick", "handbrake", "calibre", "pandoc", "sox", "lame",
  "oggenc", "flac", "wavpack", "mkvtoolnix", "mp4box", "mediainfo",
  
  /**
   * ===========================================================================
   * FILE PRINTING & EXPORT
   * ===========================================================================
   */
  
  // === PRINTING OPERATIONS ===
  "print", "printer", "paper", "size", "a4", "letter", "legal", "orientation",
  "portrait", "landscape", "color", "blackwhite", "grayscale", "duplex", "simplex",
  "collate", "uncollate", "copies", "pages", "range", "all", "current", "selection",
  
  // === EXPORT OPERATIONS ===
  "export", "saveas", "convert", "pdf", "image", "png", "jpg", "svg", "csv",
  "excel", "word", "powerpoint", "html", "markdown", "rtf", "txt", "print",
  "physical", "digital", "copy", "clone", "template",
  
  /**
   * ===========================================================================
   * FILE TEMPLATES & BOILERPLATE
   * ===========================================================================
   */
  
  // === TEMPLATE OPERATIONS ===
  "template", "boilerplate", "starter", "sample", "example", "default", "custom",
  "createfrom", "newfrom", "duplicate", "copy", "clone", "saveas", "export",
  "import", "apply", "use", "reuse", "standard", "format", "structure",
  
  // === TEMPLATE TYPES ===
  "document", "spreadsheet", "presentation", "email", "letter", "report", "invoice",
  "receipt", "contract", "agreement", "proposal", "plan", "schedule", "budget",
  "resume", "cv", "portfolio", "website", "code", "script", "config", "settings",
  
  /**
   * ===========================================================================
   * FILE INTEGRATION & APIS
   * ===========================================================================
   */
  
  // === INTEGRATION OPERATIONS ===
  "api", "integration", "connect", "link", "sync", "import", "export", "webhook",
  "callback", "notification", "event", "trigger", "action", "automation", "zapier",
  "ifttt", "make", "n8n", "workflow", "pipeline", "orchestration",
  
  // === CLOUD INTEGRATIONS ===
  "googledrive", "dropbox", "onedrive", "box", "sharepoint", "salesforce",
  "slack", "teams", "discord", "notion", "confluence", "jira", "trello", "asana",
  "basecamp", "github", "gitlab", "bitbucket", "docker", "kubernetes", "aws",
  "azure", "gcp",
  
  /**
   * ===========================================================================
   * FILE UTILITIES & TOOLS
   * ===========================================================================
   */
  
  // === FILE UTILITIES ===
  "utility", "tool", "software", "application", "app", "program", "script",
  "batch", "shell", "command", "cli", "gui", "interface", "dashboard", "panel",
  "console", "terminal", "window", "dialog", "wizard", "assistant", "helper",
  
  // === FILE MANAGERS ===
  "explorer", "finder", "nautilus", "dolphin", "thunar", "pcmanfm", "midnight",
  "commander", "total", "double", "commander", "far", "manager", "xyplorer",
  "directory", "opus", "qdir", "one", "commander",
  
  /**
   * ===========================================================================
   * EVERYDAY TASKS & COMMANDS
   * ===========================================================================
   */
  
  // === DAILY TASKS ===
  "organize", "tidy", "clean", "sort", "arrange", "categorize", "label", "tag",
  "backup", "sync", "update", "upgrade", "maintain", "check", "verify", "scan",
  "audit", "review", "archive", "delete", "remove", "free", "space", "optimize",
  "defragment", "compress", "encrypt", "decrypt", "share", "collaborate",
  
  // === COMMON COMMANDS ===
  "ls", "dir", "cd", "pwd", "cp", "copy", "mv", "move", "rm", "del", "mkdir",
  "md", "rmdir", "rd", "cat", "type", "more", "less", "head", "tail", "grep",
  "find", "locate", "which", "where", "chmod", "chown", "chgrp", "ln", "link",
  "touch", "stat", "file", "du", "df", "mount", "umount", "tar", "zip", "unzip",
  "gzip", "gunzip", "bzip2", "bunzip2", "rsync", "scp", "sftp", "ftp", "curl",
  "wget", "ssh", "diff", "patch", "awk", "sed", "cut", "paste", "sort", "uniq",
  "wc", "tee", "xargs", "nohup", "bg", "fg", "jobs", "kill", "ps", "top", "htop",
  "free", "vmstat", "iostat", "netstat", "ss", "ping", "traceroute", "dig",
  "nslookup", "host", "whois", "ifconfig", "ip", "route", "iptables", "firewall",
  "crontab", "at", "systemctl", "service", "journalctl", "dmesg", "last", "who",
  "w", "finger", "id", "groups", "passwd", "sudo", "su", "visudo", "adduser",
  "useradd", "deluser", "usermod", "addgroup", "groupadd", "delgroup", "groupmod",
  "apt", "yum", "dnf", "pacman", "zypper", "emerge", "brew", "pip", "npm", "yarn",
  "gem", "cargo", "go", "make", "cmake", "configure", "autoconf", "automake",
  "gcc", "g++", "clang", "clang++", "javac", "java", "python", "python3", "ruby",
  "perl", "php", "node", "npm", "yarn", "docker", "kubectl", "terraform",
  "ansible", "vagrant", "packer", "git", "svn", "hg", "cvs", "curl", "wget",
  "jq", "yq", "xmlstarlet", "csvkit", "pandoc", "ffmpeg", "imagemagick",
  "graphicsmagick", "openssl", "gpg", "ssh-keygen", "rsync", "tar", "zip",
  "unzip", "7z", "rar", "unrar"
];

module.exports = FILE_FOLDER_OPERATIONS_WORDS;