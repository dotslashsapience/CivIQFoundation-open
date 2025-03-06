#!/bin/bash

# Script to add license headers to all source files
# Usage: ./add-license-headers.sh

# Open Source License Header
HEADER_JS="/**
 * CivIQ Platform - Open Source Component
 * Copyright (C) 2025 CivIQ Team
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

"

HEADER_CSS="/**
 * CivIQ Platform - Open Source Component
 * Copyright (C) 2025 CivIQ Team
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

"

HEADER_MD="<!--
CivIQ Platform - Open Source Component
Copyright (C) 2025 CivIQ Team

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->

"

# Find and add headers to all JavaScript/TypeScript files
find ../launch-critical ../post-launch -type f -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | while read file; do
    if ! grep -q "CivIQ Platform - Open Source Component" "$file"; then
        echo "Adding license header to $file"
        temp_file=$(mktemp)
        echo "$HEADER_JS" > "$temp_file"
        cat "$file" >> "$temp_file"
        mv "$temp_file" "$file"
    fi
done

# Find and add headers to all CSS files
find ../launch-critical ../post-launch -type f -name "*.css" -o -name "*.scss" -o -name "*.sass" | while read file; do
    if ! grep -q "CivIQ Platform - Open Source Component" "$file"; then
        echo "Adding license header to $file"
        temp_file=$(mktemp)
        echo "$HEADER_CSS" > "$temp_file"
        cat "$file" >> "$temp_file"
        mv "$temp_file" "$file"
    fi
done

# Find and add headers to all Markdown files
find ../launch-critical ../post-launch -type f -name "*.md" | while read file; do
    if ! grep -q "CivIQ Platform - Open Source Component" "$file"; then
        echo "Adding license header to $file"
        temp_file=$(mktemp)
        echo "$HEADER_MD" > "$temp_file"
        cat "$file" >> "$temp_file"
        mv "$temp_file" "$file"
    fi
done

echo "License headers have been added to all source files."