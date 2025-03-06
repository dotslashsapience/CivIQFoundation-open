#!/bin/bash

# Script to add license headers to all source files
# Usage: ./add-license-headers.sh

# Closed Source License Header
HEADER_JS="/**
 * CivIQ Platform - Closed Source Component
 * Copyright (C) 2025 CivIQ Team
 * 
 * All rights reserved. This code is proprietary and confidential.
 * Unauthorized copying, transfer, or reproduction of this file, 
 * via any medium, is strictly prohibited.
 */

"

HEADER_CSS="/**
 * CivIQ Platform - Closed Source Component
 * Copyright (C) 2025 CivIQ Team
 * 
 * All rights reserved. This code is proprietary and confidential.
 * Unauthorized copying, transfer, or reproduction of this file, 
 * via any medium, is strictly prohibited.
 */

"

HEADER_MD="<!--
CivIQ Platform - Closed Source Component
Copyright (C) 2025 CivIQ Team

All rights reserved. This code is proprietary and confidential.
Unauthorized copying, transfer, or reproduction of this file, 
via any medium, is strictly prohibited.
-->

"

# Find and add headers to all JavaScript/TypeScript files
find ../launch-critical ../post-launch -type f -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | while read file; do
    if ! grep -q "CivIQ Platform - Closed Source Component" "$file"; then
        echo "Adding license header to $file"
        temp_file=$(mktemp)
        echo "$HEADER_JS" > "$temp_file"
        cat "$file" >> "$temp_file"
        mv "$temp_file" "$file"
    fi
done

# Find and add headers to all CSS files
find ../launch-critical ../post-launch -type f -name "*.css" -o -name "*.scss" -o -name "*.sass" | while read file; do
    if ! grep -q "CivIQ Platform - Closed Source Component" "$file"; then
        echo "Adding license header to $file"
        temp_file=$(mktemp)
        echo "$HEADER_CSS" > "$temp_file"
        cat "$file" >> "$temp_file"
        mv "$temp_file" "$file"
    fi
done

# Find and add headers to all Markdown files
find ../launch-critical ../post-launch -type f -name "*.md" | while read file; do
    if ! grep -q "CivIQ Platform - Closed Source Component" "$file"; then
        echo "Adding license header to $file"
        temp_file=$(mktemp)
        echo "$HEADER_MD" > "$temp_file"
        cat "$file" >> "$temp_file"
        mv "$temp_file" "$file"
    fi
done

echo "License headers have been added to all source files."