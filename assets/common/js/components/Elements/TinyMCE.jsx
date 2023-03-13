import React from 'react';
import PropTypes from 'prop-types';

import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Structure } from "@commonComponents/Elements/Fields";
import { Editor } from "@tinymce/tinymce-react";

const URL_UPLOAD_IMAGE = 'api_images_upload';

export function TinyMCE (props){
    const { reference, identifiant, valeur, type, onChange, children } = props;

    let content = <Editor
        tinymceScriptSrc={location.origin + '/tinymce/tinymce.min.js'}
        onInit={(evt, editor) => reference.current = editor}
        id={identifiant}
        initialValue={valeur}
        init={{
            menubar: false,
            plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'help', 'wordcount',
                'image', 'autoresize', 'emoticons'
            ],
            toolbar: 'undo redo | blocks | ' +
                'bold italic forecolor | image emoticons | ' +
                'alignleft aligncenter alignright alignjustify | ' +
                'bullist numlist outdent indent | ' +
                'removeformat | help',
            content_style: 'body { font-family:Barlow,Helvetica,Arial,sans-serif; font-size:14px }',
            automatic_uploads: true,
            images_upload_url: Routing.generate(URL_UPLOAD_IMAGE, {'type': type}),
        }}
        onChange={(e) => onChange(e, identifiant, reference)}
    />

    return (<Structure {...props} content={content} label={children} />)
}

TinyMCE.propTypes = {
    reference: PropTypes.node.isRequired,
    identifiant: PropTypes.string.isRequired,
    type: PropTypes.number.isRequired,
    valeur: PropTypes.node,
    errors: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired,
    onChange: PropTypes.func.isRequired,
}
