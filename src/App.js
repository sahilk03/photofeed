import React from "react";
import "./App.css";
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  createMasonryCellPositioner,
  Masonry,
  InfiniteLoader,
} from "react-virtualized";
import "react-virtualized/styles.css"; // only needs to be imported once

const cache = new CellMeasurerCache({
  defaultHeight: 400,
  defaultWidth: 400,
  fixedWidth: false,
});

// Our masonry layout will use 3 columns with a 10px gutter between
const cellPositioner = createMasonryCellPositioner({
  cellMeasurerCache: cache,
  columnCount: 2,
  columnWidth: 400,
  spacer: 100,
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      counter: 2,
      modal: {},
      coursal: 0,
    };
    this.loadMore = this.loadMore.bind(this);
    this.openModal = this.openModal.bind(this);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.cellRenderer = this.cellRenderer.bind(this);
  }

  cellRenderer = ({ index, key, parent, style }) => {
    let imgobj = this.state.images[key];
    return (
      <CellMeasurer cache={cache} index={index} key={key} parent={parent}>
        <div
          className={key + " CellMeasurer"}
          key={imgobj.id + key}
          style={style}
        >
          <div
            className="image_tile"
            key={imgobj.id + key}
            onClick={(e) => this.openModal(e, index)}
          >
            <div
              className="image_image"
              style={{
                backgroundImage: "url(" + imgobj.urls.regular + ")",
              }}
            ></div>
          </div>
        </div>
      </CellMeasurer>
    );
  };

  render() {
    const { modal, images } = this.state;
    return (
      <div className="App">
        {false &&
          images &&
          images.map((imgobj, index) => (
            <div
              className="image_tile"
              key={imgobj.blur_hash + index}
              onClick={(e) => this.openModal(e, index)}
            >
              <div
                className="image_image"
                style={{
                  backgroundImage: "url(" + imgobj.urls.regular + ")",
                }}
              ></div>
              {/* {imgobj.description && (
                <div className="image_details">
                  <div className="image_loc_details">
                    <p className="title">{imgobj.description}</p>
                  </div>
                </div>
              )} */}
            </div>
          ))}
        {images.length > 0 && (
          // <InfiniteLoader
          //   loadMoreRows={this.loadMore}
          //   rowCount={5}
          //   ref={(ref) => (this.infiniteLoaderRef = ref)}
          // >
          //   {({ onRowsRendered, registerChild }) => (
          <AutoSizer className="autosizer">
            {({ width, height }) => (
              <Masonry
                className={"Masonry"}
                height={900}
                width={800}
                cellCount={images.length}
                cellMeasurerCache={cache}
                cellPositioner={cellPositioner}
                cellRenderer={this.cellRenderer}
                onScroll={this.handleScroll}
                // onRowsRendered={onRowsRendered}
                // ref={(el) => {
                //   this.listRef = el;
                //   registerChild(el);
                // }}
                // overscanRowCount={2}
              />
            )}
          </AutoSizer>
          // )}
          //  </InfiniteLoader>
        )}

        {modal && modal.active && (
          <div id="myModal" className="modal">
            <i className="arrow left" onClick={this.prev}></i>
            <div className="modal-content">
              <span
                className="close"
                onClick={() => this.setState({ modal: {} })}
              >
                &times;
              </span>
              <div className="modal_img_container">
                <div
                  className="modal_allimg_container"
                  id="modal_allimg_container"
                  key={images[modal.index].id}
                >
                  {modal.index - 1 >= 0 && (
                    <div
                      className="modal_image prev"
                      style={{
                        backgroundImage:
                          "url(" + images[modal.index - 1].urls.regular + ")",
                      }}
                      key={images[modal.index - 1].id}
                    ></div>
                  )}
                  <div
                    className="modal_image center"
                    style={{
                      backgroundImage:
                        "url(" + images[modal.index].urls.regular + ")",
                    }}
                    key={images[modal.index].id}
                  ></div>
                  {modal.index + 1 < images.length && (
                    <div
                      className="modal_image next"
                      style={{
                        backgroundImage:
                          "url(" + images[modal.index + 1].urls.regular + ")",
                      }}
                      key={images[modal.index + 1].id}
                    ></div>
                  )}
                </div>
              </div>
            </div>
            <i className="arrow right" onClick={this.next}></i>
          </div>
        )}
      </div>
    );
  }

  componentDidMount() {
    // this.scrollListener = window.addEventListener("scroll", (e) => {
    //   this.handleScroll(e);
    // });
    fetch(
      "https://api.unsplash.com/search/photos/?client_id=levmXPJt042n0tdR8HAbQUSgEPhb-B7Eh7W8xmjii_4&query=cars"
    )
      .then((res) => res.json())
      .then((data) => data.results)
      .then((data) => {
        console.log(data);
        this.setState({ images: data });
      });
  }

  handleScroll = (obj) => {
    if (obj && obj.scrollHeight < obj.scrollTop + obj.clientHeight + 200) {
      this.loadMore();
    }
  };

  loadMore = () => {
    fetch(
      "https://api.unsplash.com/search/photos/?client_id=levmXPJt042n0tdR8HAbQUSgEPhb-B7Eh7W8xmjii_4&query=cars&page=" +
        this.state.counter
    )
      .then((res) => res.json())
      .then((data) => data.results)
      .then((data) => {
        console.log(data);
        this.setState((prevStat) => {
          return {
            images: [...prevStat.images, ...data],
            counter: prevStat.counter + 1,
          };
        });
      });
  };

  openModal = (e, index) => {
    this.setState({
      modal: { active: true, index: index },
    });
    // this.loadMore();
  };

  prev = () => {
    if (this.state.modal.index > 0) {
      setTimeout(() => {
        this.setState((state) => {
          if (state.modal.index > 0)
            return { modal: { active: true, index: state.modal.index - 1 } };
        });
      }, 4000);

      if (document.getElementById("modal_allimg_container")) {
        document
          .getElementById("modal_allimg_container")
          .classList.add("slidingleft");
      }
    }
  };
  next = () => {
    if (this.state.modal.index < this.state.images.length - 1) {
      setTimeout(() => {
        this.setState((state) => {
          if (state.modal.index < state.images.length - 1)
            return { modal: { active: true, index: state.modal.index + 1 } };
        });
      }, 4000);
      if (document.getElementById("modal_allimg_container")) {
        document
          .getElementById("modal_allimg_container")
          .classList.add("slidingright");
      }
    }
  };
}

export default App;
