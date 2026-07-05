## Relationships between schemas

User
 ├── owns Documents
 ├── member of Documents
 ├── creates Versions
 └── creates Operations

Document
 ├── has Members
 ├── has Versions
 └── has Operations

DocumentMember
 └── stores permissions
     stores last synced version

DocumentVersion
 └── snapshot history

DocumentOperation
 └── offline sync queue