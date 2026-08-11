#!/bin/bash
# Split wilayah.sql into separate INSERT files

# Get line numbers of all INSERT statements
INSERT_LINES=$(grep -n "^INSERT INTO" wilayah.sql | cut -d: -f1)

# Count total INSERT blocks
TOTAL=$(echo "$INSERT_LINES" | wc -l)
echo "Found $TOTAL INSERT blocks"

# Split the file
INPUT="wilayah.sql"
COUNT=1

# Get first INSERT line
PREV_LINE=43  # First INSERT is at line 43

for LINE in $INSERT_LINES; do
    if [ $COUNT -eq $TOTAL ]; then
        # Last block: from INSERT to end
        sed -n "${PREV_LINE},\$p" "$INPUT" > "split/part_${COUNT}.sql"
    else
        # Not last block: from INSERT to before next VALUES
        NEXT_INSERT=$((LINE + 1))
        sed -n "${PREV_LINE},$((NEXT_INSERT - 2))p" "$INPUT" > "split/part_${COUNT}.sql"
        PREV_LINE=$LINE
    fi
    COUNT=$((COUNT + 1))
done

echo "Split into $TOTAL files in 'split/' folder"

# Create main file with all parts
cat split/part_*.sql > wilayah-all.sql
echo "Created wilayah-all.sql with all parts combined"
