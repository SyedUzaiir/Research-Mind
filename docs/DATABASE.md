# AntiGravity AI — Database ERD & Schema Specification

## 1. Overview
AntiGravity AI uses PostgreSQL with the `pgvector` extension, managed via **Prisma ORM**.

## 2. Table Specifications

### `User`
- `id`: String (UUID, Primary Key)
- `email`: String (Unique)
- `name`: String
- `passwordHash`: String
- `createdAt`: DateTime (default `now()`)
- `updatedAt`: DateTime (updatedAt)

### `Workspace`
- `id`: String (UUID, Primary Key)
- `name`: String
- `description`: String?
- `ownerId`: String (FK -> User.id)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### `WorkspaceMember`
- `id`: String (UUID, Primary Key)
- `workspaceId`: String (FK -> Workspace.id)
- `userId`: String (FK -> User.id)
- `role`: String (e.g. `OWNER`, `EDITOR`, `VIEWER`)

### `Paper`
- `id`: String (UUID, Primary Key)
- `workspaceId`: String (FK -> Workspace.id)
- `uploadedBy`: String (FK -> User.id)
- `title`: String
- `authors`: String[] / String
- `year`: Int?
- `journal`: String?
- `abstract`: String?
- `fileUrl`: String
- `fileSize`: Int?
- `status`: String (e.g. `PENDING`, `PROCESSING`, `INDEXED`, `FAILED`)
- `createdAt`: DateTime

### `PaperChunk`
- `id`: String (UUID, Primary Key)
- `paperId`: String (FK -> Paper.id)
- `chunkIndex`: Int
- `text`: String
- `embedding`: Unsupported("vector(1536)") / Unsupported("vector(768)")
- `pageNumber`: Int
- `boundingBox`: Json (e.g. `{ "x": 100, "y": 150, "w": 400, "h": 20 }`)
- `createdAt`: DateTime

### `Annotation`
- `id`: String (UUID, Primary Key)
- `paperId`: String (FK -> Paper.id)
- `userId`: String (FK -> User.id)
- `pageNumber`: Int
- `highlightText`: String
- `userNote`: String?
- `color`: String (e.g. `#FFD166`)
- `boundingBox`: Json
- `createdAt`: DateTime

### `ChatHistory`
- `id`: String (UUID, Primary Key)
- `paperId`: String? (FK -> Paper.id, optional for paper-specific chat)
- `workspaceId`: String (FK -> Workspace.id)
- `userId`: String (FK -> User.id)
- `question`: String
- `answer`: String
- `citations`: Json (Array of page numbers, text snippets, and bounding boxes)
- `createdAt`: DateTime

### `Flashcard`
- `id`: String (UUID, Primary Key)
- `paperId`: String (FK -> Paper.id)
- `question`: String
- `answer`: String
- `difficulty`: String (e.g., `EASY`, `MEDIUM`, `HARD`)
- `createdAt`: DateTime
