

export const datamap_an_app_gui_ENTITY_RELATIONSHIPS = {
  // File System
  "Folder": {
    "contains": ["File", "Folder"],
    "is contained in": ["Folder"],
    "parent of": ["File", "Folder"],
    "child of": ["Folder"],
    "is root of": ["FileSystem"]
  },
  
  "File": {
    "is contained in": ["Folder"],
    "child of": ["Folder"],
    "references": ["File", "Folder"],
    "imports": ["File"],
    "depends on": ["File", "Library"],
    "is backup of": ["File"]
  },
  
  // Software Components
  "Class": {
    "inherits from": ["Class"],
    "implements": ["Interface"],
    "composes": ["Class"],
    "aggregates": ["Class"],
    "depends on": ["Class", "Interface"],
    "is called by": ["Class"],
    "calls": ["Class"],
    "contains":["contructor","method"]
  },
  
  "Interface": {
    "is implemented by": ["Class"],
    "extends": ["Interface"],
    "depends on": ["Interface"]
  },
  
  // Database
  "Table": {
    "has": ["Column", "Row"],
    "belongs to": ["Database"],
    "has relationship": ["Table"],
    "foreign key to": ["Table"],
    "primary key of": ["Column"]
  },
  
  // UI
  "UIComponent": {
    "contains": ["UIComponent"],
    "is child of": ["UIComponent"],
    "precedes": ["UIComponent"],
    "follows": ["UIComponent"],
    "controls": ["UIComponent"],
    "is controlled by": ["UIComponent"],
    "styles": ["UIComponent"]
  }
};