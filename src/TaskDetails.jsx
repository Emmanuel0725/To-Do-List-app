import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck, faTrashAlt, faEdit, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import DeleteModal from './DeleteModal'; 

const TaskDetails = ({ selectedTask }) => {
    const [showModal, setShowModal] = useState(false);
    const [tempNotes, setTempNotes] = useState('');
    const [allDone, setAllDone] = useState(false); 
    const [taskNotes, setTaskNotes] = useState(() => {
        const storedNotes = localStorage.getItem('taskNotes');
        return storedNotes ? JSON.parse(storedNotes) : {};
    });
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState(null); // State to store the note to be deleted

    useEffect(() => {
        localStorage.setItem('taskNotes', JSON.stringify(taskNotes));
    }, [taskNotes]);

    
    const handleAddNotes = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setTempNotes('');
    };

    const handleSaveNotes = () => {
        if (tempNotes.trim() === '') {
            alert('Please enter a note before saving.');
            return;
        }
        const currentDate = new Date().toLocaleString(); // Get the current date and time
        setTaskNotes(prevNotes => ({
            ...prevNotes,
            [selectedTask]: [...(prevNotes[selectedTask] || []), { id: Date.now(), content: tempNotes, created: currentDate, checked: false }]
        }));
        setShowModal(false);
        setTempNotes('');
    };
    
    const handleCheckboxChange = (noteId) => {
        const updatedNotes = { ...taskNotes };
        updatedNotes[selectedTask] = updatedNotes[selectedTask].map(note =>
            note.id === noteId ? { ...note, checked: !note.checked } : note
        );
        setTaskNotes(updatedNotes);
    };
    
    const handleDeleteNote = (noteId) => {
        setNoteToDelete(noteId); // Set the note to be deleted
        setShowDeleteModal(true); // Show the delete modal
    };

    const handleEditNote = (noteId, newContent) => {
        const updatedNotes = { ...taskNotes };
        updatedNotes[selectedTask] = updatedNotes[selectedTask].map(note =>
            note.id === noteId ? { ...note, content: newContent } : note
        );
        setTaskNotes(updatedNotes);
    };

    const handleEditButtonClick = (noteId) => {
        setEditingNoteId(noteId);
    };

    const handleSaveEditButtonClick = (noteId, newContent) => {
        if (newContent.trim() === '') {
            alert('Please fill up the input.');
            return;
        }
        handleEditNote(noteId, newContent);
        setEditingNoteId(null);
    };

    const toggleStrikeThrough = (checked) => {
        return checked ? { textDecoration: 'line-through' } : {};
    };

    const handleDoneAllNotes = () => {
        const updatedNotes = { ...taskNotes };
        const taskNoteList = updatedNotes[selectedTask];
        if (taskNoteList) {
            const updatedTaskNoteList = taskNoteList.map(note => ({ ...note, checked: !allDone }));
            updatedNotes[selectedTask] = updatedTaskNoteList;
            setTaskNotes(updatedNotes);
            setAllDone(!allDone);
        }
    };
    
    const handleDeleteAllNotes = () => {
        setShowDeleteModal(true);
    };

    const confirmDeleteNote = () => {
        const updatedNotes = { ...taskNotes };
        updatedNotes[selectedTask] = updatedNotes[selectedTask].filter(note => note.id !== noteToDelete);
        setTaskNotes(updatedNotes);
        setShowDeleteModal(false);
        setNoteToDelete(null); // Reset the note to be deleted
    };

    const confirmDeleteAllNotes = () => {
        const updatedNotes = { ...taskNotes };
        delete updatedNotes[selectedTask];
        setTaskNotes(updatedNotes);
        setShowDeleteModal(false);
    };

    return (
        <div className='container-fluid'>
            {selectedTask && (
                <div className='d-flex justify-content-between'>
                    <div>
                        <button className='fw-normal fs-6 custom-bg-purple m-4 p-3 text-center rounded-3 custom-white' onClick={handleAddNotes}>
                            <FontAwesomeIcon icon={faPlus} /> Add Notes
                        </button>
                    </div>
                    <div className='d-flex mt-4'>
                        <div>
                            <button className='fw-normal fs-6 mx-2 p-3 text-center rounded-3 custom-white border-0 custom-bg-purple' onClick={handleDoneAllNotes}> 
                                <FontAwesomeIcon icon={faCheck} /> {allDone ? "Undone All" : "Done All"}
                            </button>
                        </div>
                        <div>
                            <button className='fw-normal fs-6 custom-bg-orange p-3 text-center rounded-3 custom-white border-0' onClick={handleDeleteAllNotes}>
                                <FontAwesomeIcon icon={faTrash} /> Delete All
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className='container-fluid'>
                {taskNotes[selectedTask] && taskNotes[selectedTask].length > 0 && (
                    <div className="notes-container">
                        {taskNotes[selectedTask].map((note) => (
                            <div key={note.id} className="note-item mx-2 mt-3 rounded-3 custom-border d-flex justify-content-between align-items-center" style={toggleStrikeThrough(note.checked)}>
                                <div>
                                    {editingNoteId === note.id ? (
                                        <input type="text" className='w-100 m-4 form-control' value={note.content} onChange={(e) => handleEditNote(note.id, e.target.value)} />
                                    ) : (
                                        <div>
                                            <p className='fs-6 custom-dark-purple m-2'>{note.content}</p>
                                            <p className='m-2 custom-dark-purple'style={{ opacity: 0.6, fontSize: '0.9rem' }}> Created: {note.created}</p>
                                        </div>
                                    )}
                                </div>
                                <div className='mb-2'>
                                    <input className='mx-2 checkbox-input' type="checkbox" checked={note.checked} onChange={() => handleCheckboxChange(note.id)} />
                                    {editingNoteId === note.id ? (
                                        <button className="border-0 rounded-2 mx-1 p-2" style={{ background: '#9D71BC', color: 'white', fontSize: '15px'}} onClick={() => handleSaveEditButtonClick(note.id, note.content)}>
                                            <FontAwesomeIcon icon={faSave} />
                                        </button>
                                    ) : (
                                         <FontAwesomeIcon icon={faEdit} className="btn border-0 p-2" style={{ background: '#9D71BC', color: 'white' }} onClick={() => handleEditButtonClick(note.id)} />
                                        )}
                                        <FontAwesomeIcon icon={faTrashAlt} className="border-0 btn btn-danger mx-1 p-2" style={{ background: '#F4512C' }} onClick={() => handleDeleteNote(note.id)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {showModal && (
                   <div className="modal d-flex align-items-center justify-content-center" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <div className="modal-dialog w-100" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title custom-dark-purple fw-bold">Add Notes</h5>
                                </div>
                                <div className="modal-body">
                                    <textarea
                                        className="form-control"
                                        value={tempNotes}
                                        onChange={(e) => setTempNotes(e.target.value)}
                                    ></textarea>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="custom-bg-purple p-2 custom-white border-0 rounded-2" onClick={handleSaveNotes}>Save</button>
                                    <button type="button" className="custom-border-btn custom-dark-purple p-2 custom-white rounded-2" onClick={handleCloseModal}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <DeleteModal isOpen={showDeleteModal} onCancel={() => setShowDeleteModal(false)} onConfirm={noteToDelete !== null ? confirmDeleteNote : confirmDeleteAllNotes} />
            </div>
        );
    };
    
    export default TaskDetails;
    
