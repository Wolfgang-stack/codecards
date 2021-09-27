import React from 'react';
import {
  NavLink,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Input,
  Card,
  CardTitle
} from 'reactstrap';
import { connect } from 'react-redux';
import { addCard } from '../../actions/cardActions';
import CreateCard from './CreateCard';
import { useState } from 'react';
import { Form, Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import CouldBe from './inputs/CouldBe';
function CardModal(props) {
  const [isOpen, setOpen] = useState(false);

  const toggle = () => {
    setOpen(!isOpen);
  };

  const handleSubmit = (values) => {
    props.addCard(values);
    toggle();
  };

  return (
    <div>
      <NavLink color="dark" onClick={toggle}>
        Add Card
      </NavLink>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        style={{ width: '90vw', maxWidth: '1500px' }}
      >
        <ModalHeader toggle={toggle} className="pt-1 pb-1 ">
          <h4 className="text-pink">Add a new card</h4>
        </ModalHeader>
        <ModalBody className="pt-1">
          <Form
            onSubmit={handleSubmit}
            mutators={{ ...arrayMutators }}
            initialValues={{
              language: 'javascript',
              front: [],
              back: [],
              deck: props.decks[0] ? props.decks[0]._id : null
            }}
            render={({
              handleSubmit,
              form: {
                mutators: { push, pop, remove }
              }, // injected from final-form-arrays above
              pristine,
              form,
              submitting,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <div className="d-flex flex-column w-25 mb-3">
                  <Label htmlFor="deck">Deck:</Label>

                  <Field
                    name="deck"
                    type="select"
                    render={(propers) => (
                      <>
                        <Input type="select" {...propers.input} id="deck">
                          {props.decks.map((deck) => (
                            <option value={deck._id}>{deck.deckName}</option>
                          ))}
                        </Input>
                      </>
                    )}
                  />
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                  className="mb-3"
                >
                  <CreateCard
                    title="Front"
                    addCode={() => {
                      if (values.front.length < 3) {
                        form.mutators.push('front', {
                          type: 'code',
                          code: '//write me'
                        });
                      }
                    }}
                    addText={() => {
                      if (values.front.length < 3) {
                        push('front', { type: 'text' });
                      }
                    }}
                  >
                    <FieldArray name="front">
                      {({ fields }) =>
                        fields.map((name, index) => (
                          <div key={name}>
                            <Field
                              name={`${name}${values.front[index].type}`}
                              render={(props) => {
                                return (
                                  <CouldBe
                                    {...props}
                                    remove={() => fields.remove(index)}
                                    type={values.front[index].type}
                                  />
                                );
                              }}
                            ></Field>
                          </div>
                        ))
                      }
                    </FieldArray>
                  </CreateCard>
                  <CreateCard
                    title="Back"
                    addCode={() => {
                      if (values.back.length < 3) {
                        form.mutators.push('back', {
                          type: 'code',
                          code: '//write me'
                        });
                      }
                    }}
                    addText={() => {
                      if (values.back.length < 3) {
                        push('back', { type: 'text' });
                      }
                    }}
                  >
                    <FieldArray name="back">
                      {({ fields }) =>
                        fields.map((name, index) => (
                          <div key={name}>
                            <Field
                              name={`${name}${values.back[index].type}`}
                              render={(props) => {
                                return (
                                  <CouldBe
                                    {...props}
                                    remove={() => fields.remove(index)}
                                    type={values.back[index].type}
                                  />
                                );
                              }}
                            ></Field>
                          </div>
                        ))
                      }
                    </FieldArray>
                  </CreateCard>
                </div>
                <Button type="submit" color="success">
                  Add Card
                </Button>
              </form>
            )}
          />
        </ModalBody>
      </Modal>
    </div>
  );
}

const mapStateToProps = (state) => ({
  decks: state.auth.user.decks
});

export default connect(mapStateToProps, { addCard })(CardModal);
