import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className='has-text-centered mt-5'>
      <button className='button'>
        <span className='icon'>
          <i className='fa-solid fa-folder-plus'></i>
        </span>
        <span>
          Add folder
        </span>
      </button>
      <Link to="/items/new-item" className='button ml-4'>
        <span className='icon'>
          <i className="fa-solid fa-file-circle-plus"></i>
        </span>
        <span>
          Add item
        </span>
      </Link>
    </div>
  );
}

export default App;
