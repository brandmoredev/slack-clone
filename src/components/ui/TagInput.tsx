import { useState, useEffect } from "react"
import { ReactTags, Tag, TagSuggestion } from "react-tag-autocomplete"


type TagInputProps = {
  initialTags?: Tag[]
  suggestions?: TagSuggestion[]
  onChange?: (tags: Tag[]) => void
}

export const TagInput = ({
  initialTags = [],
  suggestions = [],
  onChange
}: TagInputProps) => {
  const [tags, setTags] = useState<Tag[]>(initialTags)

  useEffect(() => {
    onChange?.(tags)
  }, [tags, onChange])

  const handleAdd = (tag: Tag) => {
    if (!tags.find((t) => t.label === tag.label)) {
      setTags([...tags, tag])
    }
  }

  const handleDelete = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index)
    setTags(newTags)
  }

  return (
    <div className="w-full">
      <ReactTags
        selected={tags}
        suggestions={suggestions}
        onAdd={handleAdd}
        onDelete={handleDelete}
        placeholderText="Add email or select..."
        allowNew
      />
    </div>
  )
}
