import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import ListGroup from "react-bootstrap/ListGroup";
import CompareMenu from "./components/CompareMenu";
import Comparison from "./components/Comparison";

function App() {

    const [results, setResults] = useState([]);
    const [displayResults, setDisplayResults] = useState(false);
    const [collectionIds, setCollectionIds] = useState([]);

    /**
     * Retrieves the comparison information from the Flask server.
     */
    function compare(collections) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "collections": collections })
        };
        fetch('http://127.0.0.1:5000/compare', requestOptions)
            .then(response => response.json())
            .then(data => setResults(data))
            .then(data => setCollectionIds(collections))
            .then(data => setDisplayResults(true));
    }

    return (
        <div className="App">
        {displayResults
                ? <Comparison collectionIds={collectionIds} results={results}/>
                : <CompareMenu compare={compare.bind(this)}/>
        }
        </div>
    );
}

export default App;
