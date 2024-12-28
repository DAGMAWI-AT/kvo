import React from "react";
import "./BlogDetail.css"
import { dataBlog } from "../data";
import { useParams } from "react-router";
const BlogDetails = () => {
  const { id } = useParams();
  const currentId=parseInt(id);
  const blog = dataBlog.find((p) => p.id === currentId);
  const currentIndex = dataBlog.findIndex((p) => p.id === currentId);
  const prevBlog = dataBlog[(currentIndex - 1 + dataBlog.length) % dataBlog.length];
const nextBlog = dataBlog[(currentIndex + 1) % dataBlog.length];
  return (
    <>
      <div className="page-title-area">
        <div className="d-table">
          <div className="d-table-cell">
            <div className="container">
              <h2>Blog Details</h2>
            </div>
          </div>
        </div>

        <div className="shape1">
          <img
            alt="shape"
            loading="lazy"
            width="202"
            height="202"
            decoding="async"
            data-nimg="1"
            src="/shape1.png"
            style={{ color: "transparent" }}
          />
        </div>

        <div className="shape2 rotateme">
          <img
            alt="shape"
            loading="lazy"
            width="22"
            height="22"
            decoding="async"
            data-nimg="1"
            src="/shape2.svg"
            style={{ color: "transparent" }}
          />
        </div>

        <div className="shape3">
          <img
            alt="shape"
            loading="lazy"
            width="28"
            height="28"
            decoding="async"
            data-nimg="1"
            src="/shape3.svg"
            style={{ color: "transparent" }}
          />
        </div>

        <div className="shape4">
          <img
            alt="shape"
            loading="lazy"
            width="21"
            height="20"
            decoding="async"
            data-nimg="1"
            src="/shape4.svg"
            style={{ color: "transparent" }}
          />
        </div>

        <div className="shape5">
          <img
            alt="shape"
            loading="lazy"
            width="182"
            height="146"
            decoding="async"
            data-nimg="1"
            src="/shape5.png"
            style={{ color: "transparent" }}
          />
        </div>

        <div className="shape6 rotateme">
          <img
            alt="shape"
            loading="lazy"
            width="21"
            height="20"
            decoding="async"
            data-nimg="1"
            src="/shape4.svg"
            style={{ color: "transparent" }}
          />
        </div>

        <div className="shape7">
          <img
            alt="shape"
            loading="lazy"
            width="21"
            height="20"
            decoding="async"
            data-nimg="1"
            src="/shape4.svg"
            style={{ color: "transparent" }}
          />
        </div>

        <div className="shape8 rotateme">
          <img
            alt="shape"
            loading="lazy"
            width="22"
            height="22"
            decoding="async"
            data-nimg="1"
            src="/shape2.svg"
            style={{ color: "transparent" }}
          />
        </div>
      </div>


      <div className="blog-details-area p-12">
        <div className="container">
          <div className="row1">
            <div className="lg:w-2/3 md:w-full p-8">
              <div className="blog-details-desc">
                <div className="article-image">
                  <img
                    alt="image"
                    loading="lazy"
                    width="860"
                    height="700"
                    decoding="async"
                    data-nimg="1"
                    style={{ color: "transparent" }}
                    src="/Ethiopia.jpg"
                  />
                </div>
                <div className="article-content">
                  <div className="entry-meta">
                    <ul className="flex space-x-4">
                      <li className="flex items-center space-x-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>{blog.date}</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <a href="/blog/blogdetails/:id" className="text-blue-500 hover:underline">
                          {blog.author}
                        </a>
                      </li>
                    </ul>
                  </div>

                  <h2>The security risks of changing package owners</h2>
                  <p>
                    {blog.description}
                  </p>
                  <blockquote>
                    <p>
                     {blog.quetes}
                    </p>
                    <cite>Tom Cruise</cite>
                  </blockquote>
                  <p>
                    Quuntur magni dolores eos qui ratione voluptatem sequi
                    nesciunt. Neque porro quia non numquam eius modi tempora
                    incidunt ut labore et dolore magnam dolor sit amet,
                    consectetur adipisicing.
                  </p>

                  <h3>Four major elements that we offer:</h3>
                  <ul className="features-list">
                    <li>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>{" "}
                      Scientific Skills For getting a better result
                    </li>
                    <li>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>{" "}
                      Communication Skills to getting in touch
                    </li>
                    <li>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>{" "}
                      A Career Overview opportunity Available
                    </li>
                    <li>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>{" "}
                      A good Work Environment For work
                    </li>
                  </ul>

                </div>
                <div className="article-footer">
                  <div className="article-tags">
                    <a href="/news/blogdetails/:id">News</a>
                    <a href="/news/blogdetails/:id">About</a>
                    <a href="/news/blogdetails/:id">All CSOs</a>
                    <a href="/news/blogdetails/:id">Service</a>
                    <a href="/news/blogdetails/:id">Contact</a>
                  </div>
                </div>
                <div className="startp-post-navigation">
                  <div className="prev-link-wrapper">
                    <div className="info-prev-link-wrapper">
                      <a href={`/news/blogdetails/${prevBlog.id}`}>
                        <span className="image-prev">
                          <img
                            alt="image"
                            loading="lazy"
                            width="860"
                            height="700"
                            decoding="async"
                            data-nimg="1"
                            style={{ color: "transparent" }}
                            src={prevBlog.image}                          />
                          <span className="post-nav-title">Prev</span>
                        </span>
                        <span className="prev-link-info-wrapper">
                          <span className="prev-title">{prevBlog.title}
                          </span>
                          <span className="meta-wrapper">
                            <span className="date-post">{nextBlog.date}</span>
                          </span>
                        </span>
                      </a>
                    </div>
                  </div>
                  <div className="next-link-wrapper">
                    <div className="info-next-link-wrapper">
                      <a href={`/news/blogdetails/${nextBlog.id}`}>
                        <span className="next-link-info-wrapper">
                          <span className="next-title">{nextBlog.title}
                          </span>
                          <span className="meta-wrapper">
                            <span className="date-post">{nextBlog.date}</span>
                          </span>
                        </span>
                        <span className="image-next">
                          <img
                            alt="image"
                            loading="lazy"
                            width="860"
                            height="700"
                            decoding="async"
                            data-nimg="1"
                            style={{ color: "transparent" }}
                            src={nextBlog.image}
                          />
                          <span className="post-nav-title">Next</span>
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="comments-area">
                  <h3 className="comments-title">2 Comments:</h3>
                  <ol className="comment-list">
                    <li className="comment">
                      <article className="comment-body">
                        <footer className="comment-meta">
                          <div className="comment-author vcard">
                            <img
                              alt="image"
                              loading="lazy"
                              width="95"
                              height="95"
                              decoding="async"
                              data-nimg="1"
                              className="avatar"
                              style={{ color: "transparent" }}
                              src="/Ethiopia.jpg"
                            />
                            <b className="fn">John Jones</b>
                            <span className="says">says:</span>
                          </div>
                          <div className="comment-metadata">
                            April 24, 2019 at 10:59 am
                          </div>
                        </footer>
                        <div className="comment-content">
                          <p>
                            Lorem Ipsum has been the industry’s standard dummy
                            text ever since the 1500s, when an unknown printer
                            took a galley of type and scrambled it to make a
                            type specimen.
                          </p>
                        </div>
                        <div className="reply">
                          <a
                            className="comment-reply-link"
                            href="/blog/blog-details/#"
                          >
                            Reply
                          </a>
                        </div>
                      </article>
                      <ol className="children">
                        <li className="comment">
                          <article className="comment-body">
                            <footer className="comment-meta">
                              <div className="comment-author vcard">
                                <img
                                  alt="image"
                                  loading="lazy"
                                  width="95"
                                  height="95"
                                  decoding="async"
                                  data-nimg="1"
                                  className="avatar"
                                  style={{ color: "transparent" }}
                                  src="/Ethiopia.jpg"
                                />
                                <b className="fn">Steven Smith</b>
                                <span className="says">says:</span>
                              </div>
                              <div className="comment-metadata">
                                April 24, 2019 at 10:59 am
                              </div>
                            </footer>
                            <div className="comment-content">
                              <p>
                                Lorem Ipsum has been the industry’s standard
                                dummy text ever since the 1500s, when an unknown
                                printer took a galley of type and scrambled it
                                to make a type specimen.
                              </p>
                            </div>
                            <div className="reply">
                              <a
                                className="comment-reply-link"
                                href="/blog/blog-details/#"
                              >
                                Reply
                              </a>
                            </div>
                          </article>
                        </li>
                        <ol className="children">
                          <li className="comment">
                            <article className="comment-body">
                              <footer className="comment-meta">
                                <div className="comment-author vcard">
                                  <img
                                    alt="image"
                                    loading="lazy"
                                    width="95"
                                    height="95"
                                    decoding="async"
                                    data-nimg="1"
                                    className="avatar"
                                    style={{ color: "transparent" }}
                                    src="/Ethiopia.jpg"
                                  />
                                  <b className="fn">Sarah Taylor</b>
                                  <span className="says">says:</span>
                                </div>
                                <div className="comment-metadata">
                                  April 24, 2019 at 10:59 am
                                </div>
                              </footer>
                              <div className="comment-content">
                                <p>
                                  Lorem Ipsum has been the industry’s standard
                                  dummy text ever since the 1500s, when an
                                  unknown printer took a galley of type and
                                  scrambled it to make a type specimen.
                                </p>
                              </div>
                              <div className="reply">
                                <a
                                  className="comment-reply-link"
                                  href="/blog/blog-details/#"
                                >
                                  Reply
                                </a>
                              </div>
                            </article>
                          </li>
                        </ol>
                      </ol>
                    </li>
                    <li className="comment">
                      <article className="comment-body">
                        <footer className="comment-meta">
                          <div className="comment-author vcard">
                            <img
                              alt="image"
                              loading="lazy"
                              width="95"
                              height="95"
                              decoding="async"
                              data-nimg="1"
                              className="avatar"
                              style={{ color: "transparent" }}
                              src="/Ethiopia.jpg"
                            />
                            <b className="fn">John Doe</b>
                            <span className="says">says:</span>
                          </div>
                          <div className="comment-metadata">
                            April 24, 2019 at 10:59 am
                          </div>
                        </footer>
                        <div className="comment-content">
                          <p>
                            Lorem Ipsum has been the industry’s standard dummy
                            text ever since the 1500s, when an unknown printer
                            took a galley of type and scrambled it to make a
                            type specimen.
                          </p>
                        </div>
                        <div className="reply">
                          <a
                            className="comment-reply-link"
                            href="/blog/blog-details/#"
                          >
                            Reply
                          </a>
                        </div>
                      </article>
                      <ol className="children">
                        <li className="comment">
                          <article className="comment-body">
                            <footer className="comment-meta">
                              <div className="comment-author vcard">
                                <img
                                  alt="image"
                                  loading="lazy"
                                  width="95"
                                  height="95"
                                  decoding="async"
                                  data-nimg="1"
                                  className="avatar"
                                  style={{ color: "transparent" }}
                                  src="/Ethiopia.jpg"
                                />
                                <b className="fn">James Anderson</b>
                                <span className="says">says:</span>
                              </div>
                              <div className="comment-metadata">
                                April 24, 2019 at 10:59 am
                              </div>
                            </footer>
                            <div className="comment-content">
                              <p>
                                Lorem Ipsum has been the industry’s standard
                                dummy text ever since the 1500s, when an unknown
                                printer took a galley of type and scrambled it
                                to make a type specimen.
                              </p>
                            </div>
                            <div className="reply">
                              <a
                                className="comment-reply-link"
                                href="/blog/blog-details/#"
                              >
                                Reply
                              </a>
                            </div>
                          </article>
                        </li>
                      </ol>
                    </li>
                  </ol>
                  <div className="comment-respond">
                    <h3 className="comment-reply-title">Leave a Reply</h3>
                    <form className="comment-form">
                      <p className="comment-notes">
                        <span id="email-notes">
                          Your email address will not be published.
                        </span>
                        Required fields are marked
                        <span className="required">*</span>
                      </p>
                      <p className="comment-form-comment">
                        <label>Comment</label>
                        <textarea
                          name="comment"
                          id="comment"
                          cols="45"
                          rows="5"
                          maxlength="65525"
                          placeholder="write this ........"
                          required=""
                        ></textarea>
                      </p>
                      <p className="comment-form-author">
                        <label>
                          Name <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          id="author"
                          name="author"
                          required=""
                        />
                      </p>
                      <p className="comment-form-email">
                        <label>
                          Email <span className="required">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="email"
                          required=""
                        />
                      </p>
                      <p className="comment-form-url">
                        <label>Website</label>
                        <input type="url" id="url" name="url" />
                      </p>
                      <p className="comment-form-cookies-consent">
                        <input
                          type="checkbox"
                          name="comment-cookies-consent"
                          id="comment-cookies-consent"
                          value="yes"
                        />
                        <label for="comment-cookies-consent">
                          Save my name, email, and website in this browser for
                          the next time I comment.
                        </label>
                      </p>

                      <p className="form-submit">
                        <input
                          type="submit"
                          name="submit"
                          id="submit"
                          className="submit w-44"
                          value="Post Comment"
                        />
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/3 p-8">
              <div className="widget-area" id="secondary">
                <div className="widget widget_search">
                  <form className="search-form">
                    <label>
                      <input
                        type="search"
                        className="search-field"
                        placeholder="Search..."
                      />
                    </label>
                    <button type="submit">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                    </button>
                  </form>
                </div>
                <div className="widget widget_startp_posts_thumb">
                  <h3 className="widget-title">Popular Posts</h3>
                  <article className="item">
                    <a className="thumb" href="/blog/blog-details/">
                      <span
                        className="fullimage cover"
                        role="img"
                        style={{ backgroundImage: "url(/Ethiopia.jpg)" }}
                      ></span>
                    </a>
                    <div className="info">
                      <time>June 10, 2022</time>
                      <h4 className="title usmall">
                        <a href="/blog/blog-details/">
                          Making Peace With The Feast Or Famine Of Freelancing
                        </a>
                      </h4>
                    </div>
                    <div className="clear"></div>
                  </article>
                  <article className="item">
                    <a className="thumb" href="/blog/blog-details/">
                      <span
                        className="fullimage cover"
                        role="img"
                        style={{ backgroundImage: "url(/Ethiopia.jpg)" }}
                      ></span>
                    </a>
                    <div className="info">
                      <time>June 21, 2022</time>
                      <h4 className="title usmall">
                        <a href="/blog/blog-details/">
                          I Used The Web For A Day On A 50 MB Budget
                        </a>
                      </h4>
                    </div>
                    <div className="clear"></div>
                  </article>
                  <article className="item">
                    <a className="thumb" href="/blog/blog-details/">
                      <span
                        className="fullimage cover"
                        role="img"
                        style={{ backgroundImage: "url('/Ethiopia.jpg')" }}
                      ></span>
                    </a>
                    <div className="info">
                      <time>June 30, 2022</time>
                      <h4 className="title usmall">
                        <a href="/blog/blog-details/">
                          How To Create A Responsive Popup Gallery?
                        </a>
                      </h4>
                    </div>
                    <div className="clear"></div>
                  </article>
                </div>
                <div className="widget widget_categories">
                  <h3 className="widget-title">Categories</h3>
                  <ul>
                    <li>
                      <a href="/blog/">Business</a>
                    </li>
                    <li>
                      <a href="/blog/">Privacy</a>
                    </li>
                    <li>
                      <a href="/blog/">Technology</a>
                    </li>
                    <li>
                      <a href="/blog/">Tips</a>
                    </li>
                    <li>
                      <a href="/blog/">Uncategorized</a>
                    </li>
                  </ul>
                </div>
                <div className="widget widget_tag_cloud">
                  <h3 className="widget-title">Tags</h3>
                  <div className="tagcloud">
                    <a href="/blog/">
                      IT <span className="tag-link-count">(3)</span>
                    </a>
                    <a href="/blog/">
                      Spacle <span className="tag-link-count">(3)</span>
                    </a>
                    <a href="/blog/">
                      Games <span className="tag-link-count">(2)</span>
                    </a>
                    <a href="/blog/">
                      Fashion <span className="tag-link-count">(2)</span>
                    </a>
                    <a href="/blog/">
                      Travel <span className="tag-link-count">(1)</span>
                    </a>
                    <a href="/blog/">
                      Smart <span className="tag-link-count">(1)</span>
                    </a>
                    <a href="/blog/">
                      Marketing <span className="tag-link-count">(1)</span>
                    </a>
                    <a href="/blog/">
                      Tips <span className="tag-link-count">(2)</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetails;
