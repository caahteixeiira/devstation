# DevStation — Database Model

```mermaid
erDiagram
    USER {
        int id PK
        string name
        string email UK
        string password_hash
        string role
        datetime created_at
        datetime updated_at
    }

    PROJECT {
        int id PK
        string title
        string slug UK
        string summary
        string problem
        string solution
        string architecture
        string status
        string github_url
        string demo_url
        datetime created_at
        datetime updated_at
    }

    TECHNOLOGY {
        int id PK
        string name UK
        string category
        datetime created_at
        datetime updated_at
    }

    PROJECT_FEATURE {
        int id PK
        int project_id FK
        string title
        string description
        int order
    }

    PROJECT_IMPROVEMENT {
        int id PK
        int project_id FK
        string description
        int order
        datetime created_at
    }

    PROJECT_IMAGE {
        int id PK
        int project_id FK
        string image_url
        string alt_text
        int order
        datetime created_at
    }

    DECISION {
        int id PK
        int project_id FK
        string title
        string context
        string decision
        string consequences
        datetime created_at
    }

    ARTICLE {
        int id PK
        int project_id FK
        string title
        string slug UK
        string summary
        string content
        string category
        string status
        datetime published_at
        datetime created_at
        datetime updated_at
    }

    EXPERIMENT {
        int id PK
        int project_id FK
        string title
        string objective
        string result
        string status
        datetime created_at
        datetime updated_at
    }

    ROADMAP_ITEM {
        int id PK
        string title
        string description
        string status
        int order
        datetime completed_at
        datetime created_at
        datetime updated_at
    }

    EXPERIENCE {
        int id PK
        string company
        string role
        string description
        date start_date
        date end_date
        boolean current
        datetime created_at
        datetime updated_at
    }

    EXPERIENCE_RESPONSIBILITY {
        int id PK
        int experience_id FK
        string description
        int order
    }

    EXPERIENCE_ACHIEVEMENT {
        int id PK
        int experience_id FK
        string description
        int order
    }

    PROJECT_TECHNOLOGY {
        int project_id FK
        int technology_id FK
    }

    EXPERIMENT_TECHNOLOGY {
        int experiment_id FK
        int technology_id FK
    }

    EXPERIENCE_TECHNOLOGY {
        int experience_id FK
        int technology_id FK
    }

    PROJECT ||--o{ PROJECT_FEATURE : has
    PROJECT ||--o{ PROJECT_IMPROVEMENT : has
    PROJECT ||--o{ PROJECT_IMAGE : has
    PROJECT ||--o{ DECISION : has
    PROJECT ||--o{ ARTICLE : has
    PROJECT ||--o{ EXPERIMENT : may_have

    PROJECT ||--o{ PROJECT_TECHNOLOGY : uses
    TECHNOLOGY ||--o{ PROJECT_TECHNOLOGY : belongs_to

    EXPERIMENT ||--o{ EXPERIMENT_TECHNOLOGY : uses
    TECHNOLOGY ||--o{ EXPERIMENT_TECHNOLOGY : belongs_to

    EXPERIENCE ||--o{ EXPERIENCE_RESPONSIBILITY : has
    EXPERIENCE ||--o{ EXPERIENCE_ACHIEVEMENT : has

    EXPERIENCE ||--o{ EXPERIENCE_TECHNOLOGY : uses
    TECHNOLOGY ||--o{ EXPERIENCE_TECHNOLOGY : belongs_to