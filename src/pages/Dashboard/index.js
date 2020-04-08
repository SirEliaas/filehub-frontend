import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import CopyToClipboard from 'react-copy-to-clipboard'
import { 
    FaFileExport,
    FaTrash,
    FaShare,
    FaExternalLinkAlt
 } from 'react-icons/fa'

// Components
import Navbar from '../../components/Navbar'

import api from '../../services/api'
import bytesToSize from '../../config/bytesToSize'

// Styles
import { 
    Container,
    Header,
    UploadContainer,
    Text,
    UploadContent,
 } from './styles'

//  Components
import Upload from '../../components/Upload'

export default function Dashboard() {
    const history = useHistory()
    const [user, setUser] = useState('')
    const [files, setFiles] = useState([])
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        async function loadUser() {
            await api.get('/getUser', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('@u_id')}`
                }
            }).then((response) => {
                return setUser(response.data.user)
            }).catch(() => {
                localStorage.clear()
                return history.push('/signin')
            })
        }

        loadUser()
    }, [history])

    useEffect(() => {
        async function loadFiles() {
            await api.get('/files', { 
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('@u_id')}`
                }
             }).then((response) => {
                return setFiles(response.data.files)
             })
        }

        loadFiles()
    }, [user])

    async function handleDeleteFile(id) {
        await api.delete(`/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('@u_id')}`
            }
        }).then(() => {
            const file = files.filter((file) => {
                return file._id !== id
            })

            return setFiles(file)
        })
    }

    function handleCopyToClipboard() {
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 3000);
    }

    function onSearch(result) {
        return setFiles(result)
    }

    return (
        <>
            {
                user.email ? 
                <>
                { copied && <Header>Copied to the clipboard.</Header> }
                <Container>
                    <Navbar user={ user } onSearch={ onSearch } />

                    <Upload />

                    <UploadContainer>
                        <Text>YOUR UPLOADS</Text>
                        <br/>
                        <UploadContent style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%" }}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Size</th>
                                    <th>Downloads</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                { files.map((file) => (
                                    <tr key={file._id}>
                                    <td style={{ display: "flex", alignItems: "center" }}>
                                        <FaFileExport size="25" color="#888888"/>
                                        &nbsp;
                                        <span>
                                            { file.originalname } &nbsp;
                                            <Link to={`/download/${file._id}`}>
                                                <FaExternalLinkAlt size="18" color="#e02041"/>
                                            </Link>
                                        </span>
                                    </td>
                                    <td>{ bytesToSize(file.size) }</td>
                                    <td>{ file.downloads }</td>
                                    <td>
                                        <FaTrash color="#ff0000" onClick={ () => handleDeleteFile(file._id) } />
                                    </td>
                                    <td>
                                        <CopyToClipboard text={ document.URL } onCopy={ handleCopyToClipboard }>
                                            <FaShare color="#886688"/>
                                        </CopyToClipboard>
                                    </td>
                                    </tr>
                                ))}
                            </tbody>
                            
                        </table>
                        </UploadContent>
                    </UploadContainer>
                </Container>
                </>
                :
                <p>Loading...</p>
            }
        </>
    )
}