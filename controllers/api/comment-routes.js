const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');


router.get('/', (req, res) => {
    Comment.findAll({
      attributes: ['comment_text','created_at'],
      include: [
        {
          model: Post,
          attributes: ['title','post_text','created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        }
      ]
    })
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
  Comment.findOne({
    where: {
      id: req.params.id
    },
    attributes: ['comment_text','created_at'],
      include: [
        {
          model: Post,
          attributes: ['title','post_text','created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        }
      ]
  })
  .then(dbCommentData => {
    if (!dbCommentData) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }
    res.json(dbCommentData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.post('/', withAuth, (req, res) => {
    Comment.create({
        comment_text: req.body.comment_text,
        user_id: req.session.user_id,
        post_id: req.body.post_id
    })
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put('/:id', withAuth, (req, res) => {
  Comment.update(req.body, 
    {
      where: {
        id: req.params.id
      }
    }
  )
  .then(dbCommentData => {
    if (!dbCommentData) {
      res.status(404).json({ message: 'No comment found with this id' });
      return;
    }
    res.json(dbCommentData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.delete('/:id', withAuth, (req, res) => {
  Comment.destroy(
    {
      where: {
        id: req.params.id
      }
    }
  )
  .then(dbCommentData => {
    if (!dbCommentData) {
      res.status(404).json({ message: 'No comment found with this id' });
      return;
    }
    res.json(dbCommentData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

module.exports = router;