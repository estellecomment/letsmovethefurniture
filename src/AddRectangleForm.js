import React, {Component} from 'react';

// {title, submitText, addRectangleFunc, [initValues, withName]}
class AddRectangleForm extends Component {
    constructor(props) {
        super(props);

        console.log('constructor AddRectangleForm for', this.props.title);
        this.widthInput = React.createRef();
        this.heightInput = React.createRef();
        if (this.props.withName) {
            this.nameInput = React.createRef();
        }
        this.idCounter = 0;

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillUnmount() {
        console.log('unmounting AddRectangleForm for', this.props.title);
    }

    handleSubmit(event) {
        event.preventDefault();
        const newRectangle = {
            width: this.widthInput.current.value,
            height: this.heightInput.current.value,
            id: this.idCounter,
            x: 0,
            y: 0
        };
        if (this.nameInput) {
            newRectangle.name = this.nameInput.current.value;
        }
        this.idCounter = this.idCounter + 1;
        console.log("new rectangle", newRectangle);
        this.props.addRectangleFunc(newRectangle);
    };

    // uncontrolled form because I'm not doing fancy validation.
    render() {
        console.log('rendering AddRectangleForm for', this.props.title);
        return (
            <form onSubmit={this.handleSubmit}>
                <div>{this.props.title}</div>
                <div className="form-body">
                    <label>
                        Width:
                        <input type="number" ref={this.widthInput} defaultValue={this.props.initValues ? this.props.initValues.width : ""}/>
                    </label>
                    <label>
                        Height:
                        <input type="number" ref={this.heightInput} defaultValue={this.props.initValues ? this.props.initValues.height : ""}/>
                    </label>
                    {
                        this.props.withName &&
                        <label>
                            Name:
                            <input type="text" ref={this.nameInput} />
                        </label>
                    }
                </div>
                <input className="submit" type="submit" value={this.props.submitText}/>
            </form>
        )
    };
};

export default AddRectangleForm;