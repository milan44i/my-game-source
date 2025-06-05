<template>
  <div class="awesome_editor">
    <div v-if="editor" class="btn_container">
      <span
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
      >
        Bold
      </span>
      <span
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
      >
        Italic
      </span>
      <span
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
      >
        H1
      </span>
      <span
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
      >
        H2
      </span>
      <span
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }"
      >
        bullet list
      </span>
    </div>

    <EditorContent :editor="editor" />
  </div>
</template>

<script setup>
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { watch } from 'vue'

const emit = defineEmits(['update'])
const props = defineProps(['content'])

const editor = new Editor({
  content: props.content || '',
  extensions: [StarterKit],
  onUpdate: () => {
    emit('update', editor.getHTML())
  },
  onReady: ({ editor }) => {
    // When the editor is ready, emit the initial content
    emit('update', editor.getHTML())
  },
})

watch(
  () => props.content,
  newContent => {
    // Only update if content changes and differs from current
    if (newContent && editor.getHTML() !== newContent) {
      editor.commands.setContent(newContent)
      emit('update', newContent)
    }
  },
  { immediate: true },
)
</script>
