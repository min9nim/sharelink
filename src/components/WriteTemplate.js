import './WriteTemplate.scss'

export default function WriteTemplate(props) {
  const { parent } = props
  return (
    <>
      <div className="write-title">
        {parent.link.id ? '내용 수정' : '링크 등록'}
      </div>
      <div className="wrapper">
        <div className="form">
          <div>
            <div className="label">글주소</div>
            <input
              placeholder={parent.placeholder.url}
              id="url"
              ref={(el) => {
                parent.urlInput = el
              }}
              value={parent.link.url}
              onChange={(e) => {
                parent.link.url = e.target.value
              }}
              onBlur={parent.handleBlur.bind(parent)}
            />
            <div className="init-btn">
              <i
                className="icon-cancel"
                onClick={(e) => {
                  parent.link.url = ''
                }}
              />
            </div>
          </div>
          <div>
            <div className="label">글제목</div>
            <input
              placeholder={parent.placeholder.title}
              id="title"
              ref={(el) => {
                parent.titleInput = el
              }}
              value={parent.link.title}
              onChange={(e) => {
                parent.link.title = e.target.value
              }}
            />
            <div className="init-btn">
              <i
                className="icon-cancel"
                onClick={() => {
                  parent.link.title = ''
                }}
              />
            </div>
          </div>
          <div>
            <div className="label">간단 설명(선택)</div>
            <input
              placeholder={parent.placeholder.desc}
              id="desc"
              ref={(el) => {
                parent.descInput = el
              }}
              value={parent.link.desc}
              onChange={(e) => {
                parent.link.desc = e.target.value
              }}
            />
            <div className="init-btn">
              <i
                className="icon-cancel"
                onClick={() => {
                  parent.link.desc = ''
                }}
              />
            </div>
          </div>
          <div>
            <div className="label">대표 이미지 경로</div>
            <input
              placeholder={parent.placeholder.image}
              id="image"
              ref={(el) => {
                parent.imageInput = el
              }}
              value={parent.link.image}
              onChange={(e) => {
                parent.link.image = e.target.value
              }}
            />
            <div className="init-btn">
              <i
                className="icon-cancel"
                onClick={() => {
                  parent.link.image = ''
                }}
              />
            </div>
          </div>
          <div>
            <div className="label">
              파비콘
              <img className="favicon" src={parent.link.favicon} />
            </div>
            <input
              placeholder={parent.placeholder.favicon}
              id="favicon"
              ref={(el) => {
                parent.faviconInput = el
              }}
              value={parent.link.favicon}
              onChange={(e) => {
                parent.link.favicon = e.target.value
              }}
            />
            <div className="init-btn">
              <i
                className="icon-cancel"
                onClick={() => {
                  parent.link.favicon = ''
                }}
              />
            </div>
          </div>
        </div>
        <div className="image">
          <img src={parent.link.image}></img>
        </div>
      </div>

      <div className="btn">
        <div
          onClick={parent.save.bind(parent)}
          tabIndex="0"
          onKeyPress={parent.enterSave.bind(parent)}
        >
          <i className="icon-floppy" /> 저장
        </div>
        <div
          onClick={parent.cancel.bind(parent)}
          tabIndex="0"
          onKeyPress={parent.enterCancel.bind(parent)}
        >
          <i className="icon-cancel" /> 취소
        </div>
      </div>
    </>
  )
}
