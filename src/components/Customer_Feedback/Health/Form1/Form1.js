import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function (props) {
    const classes = useStyles();

    const handleChange = (event, tag) => {
        event.stopPropagation();
        props.handleChange(event, tag)
    };

    return (
        <form id="healthForm">
            <fieldset onChange={event => props.handleChange(event, 'diabetes')}>
                <p>Diabetes/ High blood sugar levels<span>*</span></p>
                <input type="radio" name="daiabetes" value="yes" /> Yes
                <input type="radio" name="daiabetes" value="no" /> No
                {props.showDiabetesExtraQuestions ? <div>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">You are managing diabetes through</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value=""
                            onChange={(event) => handleChange(event, 'managingDiabetesThrough')}
                        >
                            <MenuItem value={1}>Oral medication</MenuItem>
                            <MenuItem value={2}>Insulin</MenuItem>
                            <MenuItem value={3}>Both (Oral medication & Insulin)</MenuItem>
                            <MenuItem value={4}>Controlled through diet and exercise</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="demo-simple-select-label">You are diabetic</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value=""
                            onChange={(event) => handleChange(event, 'diabeticSince')}
                        >
                            <MenuItem value={1}>{"< 5yrs"}</MenuItem>
                            <MenuItem value={2}>5-10 yrs</MenuItem>
                            <MenuItem value={3}>> 5yrs</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl className={classes.formControl} onChange={(event) => handleChange(event, 'complications')}>
                        <p>Any history of diabetes related complications?<span>*</span></p>
                        <input type="radio" name="complications" value="yes" /> Yes
                        <input type="radio" name="complications" value="no" /> No
                    </FormControl>

                    <FormControl className={classes.formControl} onChange={(event) => handleChange(event, 'specify')}>
                        <TextField id="standard-basic" label="Anything else please specify" />
                    </FormControl>

                </div> : null}
            </fieldset>

            <fieldset onChange={event => props.handleChange(event, 'hypertension')}>
                <p>Hypertension/ High Blood Pressure, High Cholesterol or Thyroid disorder<span>*</span></p>
                <input type="radio" name="hypertension" value="yes" /> Yes
                <input type="radio" name="hypertension" value="no" /> No
                {props.showHypertentionExtraQuestions ? <div>
                    <FormGroup row>
                        <FormControlLabel control={
                            <Checkbox
                                onChange={handleChange('checkedB')}
                                value="checkedB"
                                color="primary"
                            />
                        }
                            label="HTN/high Blood pressure but under control through medication."
                        />
                    </FormGroup>
                </div> : null}
            </fieldset>

            <fieldset onChange={event => props.handleChange(event, 'vascularDisorder')}>
                <p>Heart or vascular disorder including chest pain, stroke, heart attack or Angioplasty, CABG or any other heart surgery<span>*</span></p>
                <input type="radio" name="vascularDisorder" value="yes" /> Yes
                <input type="radio" name="vascularDisorder" value="no" /> No
            </fieldset>

            <fieldset onChange={(event) => props.handleChange(event, 'lungDisorders')} >
                <p>Breathing or lung disorders including asthma, emphysema, tuberculosis.<span>*</span></p>
                <input type="radio" name="lungDisorders" value="yes" /> Yes
                <input type="radio" name="lungDisorders" value="no" /> No
            </fieldset>

            <fieldset onChange={(event) => props.handleChange(event, 'liverProblems')}>
                <p>Liver or digestive system related disorder including jaundice ,gall bladder, pancreas. or Hepatitis B/C.<span>*</span></p>
                <input type="radio" name="liverProblems" value="yes" /> Yes
                <input type="radio" name="liverProblems" value="no" /> No
            </fieldset>

            <fieldset onChange={(event) => props.handleChange(event, 'tumor')}>
                <p>Any abnormal growth like tumour,lump,cancer or blood disorder, including anemia or thalassaemia or Sexually transmitted disease ( STD ) including HIV or AIDS<span>*</span></p>
                <input type="radio" name="tumor" value="yes" /> Yes
                <input type="radio" name="tumor" value="no" /> No
            </fieldset>

        </form>
    )
}