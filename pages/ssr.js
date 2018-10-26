
class SSRTest extends React.Component {
    static async getInitialProps ({req}) {
        return req 
            ? { from: 'server' } // 서버에서 실행 할 시
            : { from: 'client '} // 클라이언트에서 실행 할 시
    }

    render() {
        return (
            <div>
                {this.props.from} 에서 실행이 되었어요.
            </div>
        );
    }
}

export default SSRTest;