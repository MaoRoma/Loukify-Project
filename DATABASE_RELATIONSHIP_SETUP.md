# Database Relationship Setup Guide

## Overview
To properly link the `settings` and `store_templates` tables, you need to add a foreign key relationship. This ensures data integrity and makes the sync functionality more robust.

## Recommended Approach: Add settings_id to store_templates

### Step 1: Run the Migration
Execute this SQL in your Supabase SQL Editor:

```sql
-- Add settings_id column to store_templates table
ALTER TABLE store_templates 
ADD COLUMN settings_id UUID REFERENCES settings(id) ON DELETE SET NULL;

-- Create index for the foreign key
CREATE INDEX IF NOT EXISTS idx_store_templates_settings_id ON store_templates(settings_id);
```

### Step 2: Link Existing Data (Optional)
If you have existing data, run this to link templates with settings:

```sql
-- Update existing store_templates to link with settings based on user_id and email
UPDATE store_templates 
SET settings_id = (
    SELECT s.id 
    FROM settings s 
    WHERE EXISTS (
        SELECT 1 FROM auth.users au 
        WHERE au.id = store_templates.user_id 
        AND au.email = s.email_address
    )
    LIMIT 1
)
WHERE settings_id IS NULL;
```

### Step 3: Verify the Relationship
Check that the relationship works:

```sql
-- Query to see linked data
SELECT 
    st.id as template_id,
    st.store_name as template_store_name,
    s.id as settings_id,
    s.store_name as settings_store_name,
    s.store_description
FROM store_templates st
LEFT JOIN settings s ON st.settings_id = s.id
WHERE st.user_id = 'YOUR_USER_ID';
```

## Benefits of Adding the Relationship

1. **Data Integrity**: Foreign key ensures settings exist before linking
2. **Easier Queries**: Can join tables efficiently
3. **Cascade Actions**: Can set up automatic cleanup when settings are deleted
4. **Better Performance**: Indexes on foreign keys improve query speed
5. **Cleaner Code**: Backend sync functions are more reliable

## How the Updated Backend Works

### Settings Updates:
1. User changes store info in settings
2. Settings table is updated
3. `syncStoreTemplate()` finds linked template via `user_id`
4. Template is updated with new settings_id and store info

### Template Updates:
1. User changes template store info
2. Template is updated
3. `syncSettingsFromTemplate()` updates linked settings
4. Foreign key relationship is maintained

## Testing the Relationship

After running the migration, test that both directions work:

1. **Update settings** → Check if template syncs
2. **Update template** → Check if settings sync
3. **Create new store** → Verify both records are linked

## Alternative: Add user_id to settings

If you prefer to add `user_id` to settings instead:

```sql
ALTER TABLE settings 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_settings_user_id ON settings(user_id);

-- Make it unique (one settings per user)
ALTER TABLE settings ADD CONSTRAINT settings_user_id_unique UNIQUE (user_id);
```

This approach makes settings directly linked to users, which might be simpler for your use case.