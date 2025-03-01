import { marked } from 'marked';
import { Editor } from "@tinymce/tinymce-react"
import { useRef } from 'react';

const EditorChat = ({ editContent }) => {
    const editorRef = useRef(null)
    const convertMarkdownToHTML = (markdown) => {
        return marked(markdown)
    }
    return (
        <Editor
            apiKey='o61nnuwogclhd3z601n2k0zh479m9kbnsivauhaxrlu4jco0'
            onInit={(_evt, editor) => editorRef.current = editor}
            initialValue={convertMarkdownToHTML(editContent)}
            license_key='gpl'
            init={{
                height: 500,
                width: 500,
                menubar: false,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px, border:none }'
            }}
        />
    );
}

export default EditorChat;