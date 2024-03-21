import React from 'react';

const DeleteModal = ({ isOpen, onCancel, onConfirm }) => {
    return (
        isOpen && (
            <div className="modal d-flex align-items-center justify-content-center" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div className="modal-dialog w-50" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title custom-dark-purple fw-bold ">Confirm Deletion</h5>
                        </div>
                        <div className="modal-body">
                            <p className='custom-dark-purple'>Are you sure you want to delete<span className='custom-light-orange'>?</span></p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="custom-bg-purple p-2 custom-white border-0 rounded-2" onClick={onConfirm}>Delete</button>
                            <button type="button" className="custom-dark-purple custom-border-btn p-2 custom-white rounded-2" onClick={onCancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default DeleteModal;
