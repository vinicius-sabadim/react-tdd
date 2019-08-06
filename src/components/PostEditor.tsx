import React from 'react'

export default function PostEditor() {
  const [isSaving, setIsSaving] = React.useState<boolean>(false)

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault()
    setIsSaving(true)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title-input">Title</label>
      <input type="text" id="title-input" />

      <label htmlFor="content-input">Content</label>
      <textarea id="content-input" />

      <label htmlFor="tags-input">Tags</label>
      <input type="text" id="tags-input" />

      <button type="submit" disabled={isSaving}>
        Save
      </button>
    </form>
  )
}
