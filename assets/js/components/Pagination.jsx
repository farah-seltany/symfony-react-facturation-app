import React from 'react';

const Pagination = ({ currentPage, itemsPerPage, length, onPageChange }) => {


    const pageCount = Math.ceil(length / itemsPerPage)
    const pages = []

    for (let i = 1; i <= pageCount; i++) {
        pages.push(i)
    }

    return (
        <div>
            <ul className="pagination pagination-sm">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button onClick={() => onPageChange(currentPage - 1)} className="page-link">&laquo;</button>
                </li>
                {pages.map(page => (
                    <li className={`page-item ${currentPage === page ? "active" : ""}`} key={page}>
                        <button className="page-link" onClick={() => onPageChange(page)}>{page}</button>
                    </li>
                ))}
                <li className={`page-item ${currentPage === pageCount ? "disabled" : ""}`}>
                    <button onClick={() => onPageChange(currentPage + 1)} className="page-link">&raquo;</button>
                </li>
            </ul>
        </div>
    )
}

export default Pagination;
