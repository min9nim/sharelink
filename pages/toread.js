import List from '../components/List.js'
import $m from '../com/util.js'

export default class Index extends List {
  constructor(props) {
    $m.timelog.check('Index 생성자 호출')
    super(props)
  }
}
