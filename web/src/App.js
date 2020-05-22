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
        fetch('/compare', requestOptions)
            .then(response => {

                // Attempt to parse JSON from the object
                try {
                    return response.json();
                } catch (e) {
                    console.log("Failed parsing response from server; response is not valid JSON.  Likely experienced an error in the server.");
                }

            })
            .then(data => setResults(data))
            .then(data => setCollectionIds(collections))
            .then(data => setDisplayResults(true));
    }

    return (
        <div>
        {displayResults
                ? <Comparison collectionIds={collectionIds} results={results}/>
                : <CompareMenu compare={compare.bind(this)}/>
        }
        </div>
    );
}

export default App;
