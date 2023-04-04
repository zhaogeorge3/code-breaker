import * as React from 'react';
import {useState} from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import {DialogContent, DialogContentText, Typography} from "@mui/material";
import './NumberGraph.scss'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import styled from "styled-components";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
function createData(
    guess,
    correctNum,
    correctPos,
) {
    return {guess, correctNum, correctPos};
}

const StyledDialog = styled(Dialog)`
  .MuiPaper-root {
  background-color: #799ec4;
}

@media (prefers-color-scheme: light) {
  .MuiPaper-root {
    background-color: #dfe8f1;
  }
}
`;

function generateRandomIntegerInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isNum(val){
    return /^\d+$/.test(val)
}

function NumberGraph() {
    const [guessIndex, setGuessIndex] = useState(0)
    const [guessLength, setGuessLength] = useState(4)
    const [numToGuess, setNumToGuess] = useState(generateNum(4))
    const [guessData, setGuessData] = useState(genTable(4))
    const [open, setOpen] = React.useState(false);
    const [win, setWin] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function genTable(gl) {
        const table = []
        const guesses = 8 + ((gl-3)*2)
        for(let i = 0; i < guesses; i++){
            table.push(createData('','',''))

        }
        return table
    }
    function determineCorrectNum() {
        const guess = guessData[guessIndex].guess.toString()
        const correct = numToGuess.toString()
        const prevCorrect=[]
        let numCorrect = 0
        for (let i = 0; i < correct.length; i++) {
            if(correct.includes(guess[i]) && !prevCorrect.includes(guess[i])){
                numCorrect += 1
                prevCorrect.push(guess[i])
            }
        }
        return numCorrect.toString()
    }

    function generateNum(length) {
        let nums = ['0','1','2','3','4','5','6','7','8','9']
        let numbers = ""
        while (numbers.length < length) {
            const num = generateRandomIntegerInRange(0, nums.length-1)
            const number = nums.slice(num, num+1)[0]
            numbers += number
            nums = nums.filter(item => item !== number)
        }
        return numbers
    }

    function determineCorrectPos() {
        const guess = guessData[guessIndex].guess.toString()
        const correct = numToGuess.toString()
        let numCorrect = 0
        for (let i = 0; i < correct.length; i++) {
            if(correct[i] === guess[i]){
                numCorrect += 1
            }
        }
        return numCorrect.toString()
    }
    function handleChange(guess) {
        if(isNum(guess) && guess.length <= guessLength || guess === "") {
            const nextGuessData = [
                ...guessData.slice(0, guessIndex),
                createData(guess, "", ""),
                ...guessData.slice(guessIndex + 1)
            ]
            setGuessData(nextGuessData)
        }
    }

    function handleSlideChange(guess) {
        setGuessLength(guess)
        setNumToGuess(generateNum(guess))
        setGuessIndex(0)
        setGuessData(genTable(guess))
        setWin(false)
    }

    function handleGuess() {
        if(guessIndex >= guessData.length - 1){
            handleClickOpen()
        } else {
            setGuessIndex(guessIndex + 1)
            const nextGuessData = [
                ...guessData.slice(0, guessIndex),
                createData(guessData[guessIndex].guess.toString(), determineCorrectNum(), determineCorrectPos()),
                ...guessData.slice(guessIndex + 1)
            ]
            setGuessData(nextGuessData)
            if (Number(determineCorrectPos()) == guessLength) {
                setWin(true)
                handleClickOpen()
            }
        }
    }

    function getExample() {
        let ex = ""
        for (let i = 0; i < guessLength; i++ ){
            ex += "X"
        }
        return ex
    }
    return (
        <>
        <p>Given a random string of nonrepeating numbers of length {guessLength}</p>
        <p>Can you crack the code in the fewest guesses possible?</p>

            <Slider
                defaultValue={4}
                valueLabelDisplay="auto"
                onChange={(e) => {handleSlideChange(e.target.value)}}
                step={1}
                marks
                min={3}
                max={9}
            />
            <Typography id="input-slider" gutterBottom>
                Length of Number: {guessLength} ({getExample()})
            </Typography>
            {numToGuess}
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 300}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Your Guesses</TableCell>
                            <TableCell align="right">Correct Numbers</TableCell>
                            <TableCell align="right">Correct Positions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {guessData.map((row, index) => (
                            <TableRow
                                key={row.name}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                {guessIndex === index ? <TableCell component="th" scope="row">
                                    <TextField label={`${guessLength} digit guess`} variant="filled"
                                               autoFocus={true}
                                               value={guessData[guessIndex].guess}
                                               onChange={(e) => handleChange(e.target.value)}
                                               onKeyDown={(e) => (
                                                   (e.key === 'Enter' && e.target.value.toString().length === guessLength) ? handleGuess() : null
                                               )}/>
                                </TableCell> : <TableCell component="th" scope="row">
                                    {row.guess}
                                </TableCell>}
                                <TableCell align="right">{row.correctNum}</TableCell>
                                <TableCell align="right">{row.correctPos}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Stack spacing={3} direction="row" marginTop={1} justifyContent={'center'}>
                <Button variant="contained" onClick={() => handleChange("")}>Clear</Button>
                <Button
                    variant="contained"
                    sx={{
                    "&.Mui-disabled": {
                        background: "#eaeaea",
                        color: "#c0c0c0"
                    }
                }}
                        disabled={guessData[guessIndex].guess.toString().length != guessLength}
                    onClick={() => handleGuess()}>
                    Guess
                </Button>
            </Stack>
            <StyledDialog
                className={"dialog"}
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{win? "You Cracked The Code!" : 'Good Try!'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        The is Code Was: {numToGuess}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>{
                        handleClose()
                        handleSlideChange(guessLength)
                    }}>Play Again</Button>
                </DialogActions>
            </StyledDialog>
        </>
    );
}

export default NumberGraph