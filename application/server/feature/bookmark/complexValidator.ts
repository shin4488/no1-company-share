import { injectable } from 'inversify';
import { BookmarkPostParameter } from './definition/bookmarkPostParameter';
import { BookmarkComplexValidator } from './interface/complexValidator';
import { BookmarkDeleteParameter } from './definition/bookmarkDeleteParameter';
import SharedPost from '@s/common/sequelize/models/sharedPost';
import { appContainer } from '@s/common/dependencyInjection/inversify.config';
import { BadParameterErrorHandler } from '@s/common/error/handler/interface/badParameterErrorHandler';
import { types } from '@s/common/dependencyInjection/types';
import { StringUtil } from '@c/util/stringUtil';
import UserMaster from '@s/common/sequelize/models/userMaster';
import Bookmark from '@s/common/sequelize/models/bookmark';

@injectable()
export class BookmarkComplexValidatorImpl implements BookmarkComplexValidator {
  public async validateForPostNewBookmarks(
    parameter: BookmarkPostParameter,
  ): Promise<void> {
    // エラーメッセージ処理は複数メソッドにわたって使用すると、
    // 意図しないメッセージ（別メソッドで追加したメッセージ）の追加になりかねないため、クラスメンバではなくメソッド内でインスタンス取得している
    const errorHandler = appContainer.get<BadParameterErrorHandler>(
      types.BadParameterErrorHandler,
    );

    const userId = parameter.userId;
    const posts = parameter.posts;
    for (const post of posts) {
      const sharedPostErrorMessage = await this.validateExistingSharedPost(
        post.id,
      );
      if (StringUtil.isNotEmpty(sharedPostErrorMessage)) {
        errorHandler.addMessage(sharedPostErrorMessage);
      } else {
        // お気に入り存在チェックは、投稿が存在するときのみ実行する
        const bookmarkErrorMessage = await this.validateNotExistingBookmark(
          userId,
          post.id,
        );
        if (StringUtil.isNotEmpty(bookmarkErrorMessage)) {
          errorHandler.addMessage(bookmarkErrorMessage);
        }
      }
    }

    const userMasterErrorMessage = await this.validateExistingUser(
      parameter.userId,
    );
    if (StringUtil.isNotEmpty(userMasterErrorMessage)) {
      errorHandler.addMessage(userMasterErrorMessage);
    }

    errorHandler.throwIfHasError();
  }

  public async validateForDeleteBookmarks(
    parameter: BookmarkDeleteParameter,
  ): Promise<void> {
    const errorHandler = appContainer.get<BadParameterErrorHandler>(
      types.BadParameterErrorHandler,
    );

    const userId = parameter.userId;
    const posts = parameter.posts;
    for (const post of posts) {
      const sharedPostErrorMessage = await this.validateExistingSharedPost(
        post.id,
      );
      if (StringUtil.isNotEmpty(sharedPostErrorMessage)) {
        errorHandler.addMessage(sharedPostErrorMessage);
        continue;
      }

      // お気に入り存在チェックは、投稿が存在するときのみ実行する
      const bookmarkErrorMessage = await this.validateExistingBookmark(
        userId,
        post.id,
      );
      if (StringUtil.isNotEmpty(bookmarkErrorMessage)) {
        errorHandler.addMessage(bookmarkErrorMessage);
      }
    }

    const userMasterErrorMessage = await this.validateExistingUser(userId);
    if (StringUtil.isNotEmpty(userMasterErrorMessage)) {
      errorHandler.addMessage(userMasterErrorMessage);
    }

    errorHandler.throwIfHasError();
  }

  private async validateNotExistingBookmark(
    userId: string,
    sharedPostId: string,
  ): Promise<string> {
    const targetBookmark = await Bookmark.findOne({
      where: {
        userId,
        sharedPostId,
      },
    });
    return targetBookmark !== null
      ? '指定した投稿はすでにお気に入り登録済みです。'
      : '';
  }

  private async validateExistingBookmark(
    userId: string,
    sharedPostId: string,
  ): Promise<string> {
    const targetBookmark = await Bookmark.findOne({
      where: {
        userId,
        sharedPostId,
      },
    });
    return targetBookmark === null
      ? '指定した投稿はお気に入り未登録です。'
      : '';
  }

  private async validateExistingSharedPost(
    sharedPostId: string,
  ): Promise<string> {
    const targetSharedPost = await SharedPost.findByPk(sharedPostId);
    return targetSharedPost === null
      ? '存在する投稿の投稿No.を入力してください。'
      : '';
  }

  private async validateExistingUser(userId: string): Promise<string> {
    const targetUser = await UserMaster.findByPk(userId);
    return targetUser === null
      ? 'ユーザ登録後にお気に入り追加してください。'
      : '';
  }
}
