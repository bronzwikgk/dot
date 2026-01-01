from pathlib import Path
path = Path('D:/Users/0dot1/Documents/Github/dot/shunya/index/ehh_template-v1.1.8-active-KW-wonderAgent.yaml')
text = path.read_text(encoding='utf-8')
old = '    1.3_scope_management:\n      file: "EHh-MANIFEST-SCOPE.md"\n      description: "Defines feature boundaries, future enhancements, and scope change process."\n      sections:\n        - "- "1.3.1 In-Scope Features: describe in-Scope Features for EHh.""\n        - "- "1.3.2 Out-of-Scope Features: describe out-of-Scope Features for EHh.""\n        - "- "1.3.3 Future Considerations: describe future Considerations for EHh.""\n        - "- "1.3.4 Scope Change Process: describe scope Change Process for EHh.""\n        - "- "1.3.5 Prioritization Matrix: describe prioritization Matrix for EHh.""\n'
new = '''    1.3_scope_management:
      file: "EHh-MANIFEST-SCOPE.md"
      description: "Defines feature boundaries, future enhancements, and scope change process."
      sections:
        - title: "1.3.1 In-Scope Features: describe in-scope features for EHh."
          breakdown:
            - "1.3.1.1 Platform orchestration: ActionApp choreography, ActionEngine sequencing, ActionLoader datasets."
            - "1.3.1.2 Entity & storage features: ActionEntity management, ActionFs, LocalStorage, ActionIndexDb."
            - "1.3.1.3 Navigation/UI: ActionView semantic nav, pointer/hover cues, accessibility helpers."
            - "1.3.1.4 Utility + plugin surface: ActionValidator, ActionEvent, DocumentRenderer, httpService, Watchman."
        - "- \"1.3.2 Out-of-Scope Features: describe out-of-Scope Features for EHh.\""
        - "- \"1.3.3 Future Considerations: describe future Considerations for EHh.\""
        - "- \"1.3.4 Scope Change Process: describe scope Change Process for EHh.\""
        - "- \"1.3.5 Prioritization Matrix: describe prioritization Matrix for EHh.\""
'''
if old not in text:
    raise SystemExit('pattern not found')
path.write_text(text.replace(old, new), encoding='utf-8')
