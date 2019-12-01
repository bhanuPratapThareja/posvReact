import React from 'react';

export default function (props) {
    return (
        <form id="healthForm">
            <fieldset onChange={event => props.handleChange(event, 'breathing')}>
                <p>Breathing or lung disorders including asthma, emphysema, tuberculosis<span>*</span></p>
                <input type="radio" name="breathing" value="yes" /> Yes
                <input type="radio" name="breathing" value="no" /> No
            </fieldset>

            <fieldset onChange={event => props.handleChange(event, 'jaundice')}>
                <p>Liver or digestive system related disorder including jaundice ,gall bladder, pancreas. or Hepatitis B/C.<span>*</span></p>
                <input type="radio" name="jaundice" value="yes" /> Yes
                <input type="radio" name="jaundice" value="no" /> No
            </fieldset>

            <fieldset onChange={event => props.handleChange(event, 'std')}>
                <p>Any abnormal growth like tumour,lump,cancer or blood disorder, including anemia or thalassaemia or Sexually transmitted disease ( STD ) including HIV or AIDS<span>*</span></p>
                <input type="radio" name="std" value="yes" /> Yes
                <input type="radio" name="std" value="no" /> No
            </fieldset>



        </form>
    )
}