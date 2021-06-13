import './tokenInput.css';

function TokenInput(props) {
    const {onSubmit} = props
    return (
        <div>
            <h1>Enter Slack Token</h1>
            <form onSubmit={onSubmit}>
                <input type="password" />
                <input type="submit" />
            </form>
        </div>
    );
}

export default TokenInput;
