import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';

type Props = {
    value: string;
    onChange: (html: string) => void;
};

export default function RichTextEditor({ value, onChange }: Props) {
    const editorRef = useRef<unknown>(null);

    return (
        <Editor
            apiKey={import.meta.env.VITE_TINYMCE_API_KEY || 'no-api-key'}
            onInit={(_evt: unknown, editor: unknown) => (editorRef.current = editor)}
            value={value}
            onEditorChange={(content: string) => onChange(content)}
            init={{
                height: 500,
                menubar: false,
                plugins: [
                    'advlist',
                    'autolink',
                    'lists',
                    'link',
                    'image',
                    'charmap',
                    'preview',
                    'anchor',
                    'searchreplace',
                    'visualblocks',
                    'code',
                    'fullscreen',
                    'insertdatetime',
                    'media',
                    'table',
                    'help',
                    'wordcount',
                ],
                toolbar:
                    'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                content_style:
                    'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 14px }',
                skin: 'oxide',
                content_css: 'default',
                branding: false,
                promotion: false,
            }}
        />
    );
}
