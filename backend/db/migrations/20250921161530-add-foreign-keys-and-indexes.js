'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // courses.teacher_id -> users.id
    try {
      await queryInterface.addIndex('courses', ['teacher_id'], { name: 'idx_courses_teacher_id' });
    } catch (e) { /* ignore if exists */ }
    try {
      await queryInterface.addConstraint('courses', {
        fields: ['teacher_id'],
        type: 'foreign key',
        name: 'fk_courses_teacher_id_users_id',
        references: { table: 'users', field: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      });
    } catch (e) { /* ignore if exists */ }

    // courses_tags FKs and indexes
    try {
      await queryInterface.addIndex('courses_tags', ['course_id'], { name: 'idx_courses_tags_course_id' });
    } catch (e) { /* ignore */ }
    try {
      await queryInterface.addIndex('courses_tags', ['tag_id'], { name: 'idx_courses_tags_tag_id' });
    } catch (e) { /* ignore */ }
    try {
      await queryInterface.addConstraint('courses_tags', {
        fields: ['course_id', 'tag_id'],
        type: 'unique',
        name: 'uniq_courses_tags_course_tag'
      });
    } catch (e) { /* ignore */ }
    try {
      await queryInterface.addConstraint('courses_tags', {
        fields: ['course_id'],
        type: 'foreign key',
        name: 'fk_courses_tags_course_id_courses_id',
        references: { table: 'courses', field: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });
    } catch (e) { /* ignore */ }
    try {
      await queryInterface.addConstraint('courses_tags', {
        fields: ['tag_id'],
        type: 'foreign key',
        name: 'fk_courses_tags_tag_id_tags_id',
        references: { table: 'tags', field: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });
    } catch (e) { /* ignore */ }

    // post_tags FKs and indexes
    try {
      await queryInterface.addIndex('post_tags', ['postId'], { name: 'idx_post_tags_postId' });
    } catch (e) { /* ignore */ }
    try {
      await queryInterface.addIndex('post_tags', ['tagId'], { name: 'idx_post_tags_tagId' });
    } catch (e) { /* ignore */ }
    try {
      await queryInterface.addConstraint('post_tags', {
        fields: ['postId', 'tagId'],
        type: 'unique',
        name: 'uniq_post_tags_post_tag'
      });
    } catch (e) { /* ignore */ }
    try {
      await queryInterface.addConstraint('post_tags', {
        fields: ['postId'],
        type: 'foreign key',
        name: 'fk_post_tags_postId_posts_id',
        references: { table: 'posts', field: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });
    } catch (e) { /* ignore */ }
    try {
      await queryInterface.addConstraint('post_tags', {
        fields: ['tagId'],
        type: 'foreign key',
        name: 'fk_post_tags_tagId_tags_id',
        references: { table: 'tags', field: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });
    } catch (e) { /* ignore */ }
  },

  async down(queryInterface, Sequelize) {
    // Drop constraints and indexes added above (ignore if they don't exist)
    const safe = async (fn) => { try { await fn(); } catch (e) {} };

    await safe(() => queryInterface.removeConstraint('courses', 'fk_courses_teacher_id_users_id'));
    await safe(() => queryInterface.removeIndex('courses', 'idx_courses_teacher_id'));

    await safe(() => queryInterface.removeConstraint('courses_tags', 'fk_courses_tags_course_id_courses_id'));
    await safe(() => queryInterface.removeConstraint('courses_tags', 'fk_courses_tags_tag_id_tags_id'));
    await safe(() => queryInterface.removeConstraint('courses_tags', 'uniq_courses_tags_course_tag'));
    await safe(() => queryInterface.removeIndex('courses_tags', 'idx_courses_tags_course_id'));
    await safe(() => queryInterface.removeIndex('courses_tags', 'idx_courses_tags_tag_id'));

    await safe(() => queryInterface.removeConstraint('post_tags', 'fk_post_tags_postId_posts_id'));
    await safe(() => queryInterface.removeConstraint('post_tags', 'fk_post_tags_tagId_tags_id'));
    await safe(() => queryInterface.removeConstraint('post_tags', 'uniq_post_tags_post_tag'));
    await safe(() => queryInterface.removeIndex('post_tags', 'idx_post_tags_postId'));
    await safe(() => queryInterface.removeIndex('post_tags', 'idx_post_tags_tagId'));
  }
};
