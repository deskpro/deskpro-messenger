import React from 'react';

import Frame from '../core/Frame';

const iframeStyle = {
  width: '500px',
  height: '400px',
  top: '20px',
  left: '450px',
  backgroundColor: '#fff'
};

const articleStyles = {
  height: '400px',
  overflowY: 'scroll'
};

const ArticleFrame = () => (
  <Frame style={iframeStyle}>
    <article style={articleStyles}>
      <h2>Lorem Ipsum Article</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi in turpis
        vestibulum, consequat sapien ut, semper nunc. Curabitur bibendum odio at
        rhoncus facilisis. Nulla vestibulum elit eget ante hendrerit faucibus
        nec ut nisi. Suspendisse potenti. Nulla vel nibh orci. Interdum et
        malesuada fames ac ante ipsum primis in faucibus. Morbi volutpat erat ac
        risus malesuada vulputate. Pellentesque et pellentesque eros, nec
        porttitor lectus. Nam ac varius arcu. Donec in dictum nisi. Nunc
        scelerisque ante eu turpis feugiat convallis.
      </p>
      <p>
        Mauris consequat metus ex, sed imperdiet est scelerisque at. Aenean
        felis mauris, volutpat at bibendum maximus, congue non arcu. Nunc ex
        justo, pellentesque nec sapien ac, luctus vulputate arcu. Curabitur
        ultrices lacus vel augue gravida dapibus. Fusce maximus odio mollis
        nulla finibus pulvinar. Vestibulum sem nisl, tempus id felis in,
        tincidunt commodo magna. Quisque pretium augue id porta porta. Fusce
        elementum eleifend ligula non vulputate. Mauris id felis vitae tortor
        consequat pellentesque vel nec purus. Praesent vitae fermentum magna. Ut
        sit amet enim purus. Sed ultricies magna non erat condimentum, quis
        ultrices nulla semper. Duis sollicitudin mi vel dolor finibus iaculis.
        Integer a ultrices arcu, ut laoreet lacus. Vestibulum finibus metus at
        nunc rhoncus luctus. Duis sit amet arcu condimentum, hendrerit libero
        et, volutpat dolor.
      </p>
    </article>
  </Frame>
);

export default ArticleFrame;
