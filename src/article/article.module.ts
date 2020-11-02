import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from 'src/entities/article.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserEntity } from 'src/entities/user.entity';
import { CommentsService } from './comments.service';
import { CommentEntity } from 'src/entities/comment.enitty';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, UserEntity, CommentEntity]), AuthModule],
  providers: [ArticleService, CommentsService],
  controllers: [ArticleController]
})
export class ArticleModule {}
